import { AfterViewInit, Input } from '@angular/core';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { EMAIL_PATTERN } from '../../../@auth/components';
import {
  ClientClient, ClientFoodClient, CreateClientFoodCommand, Gender, UnitOfMeasurement, UpdateClientByUserId,
  UpdateClientStatus
} from '../../../Nutricalc-api';
import { Messages } from '../../../pages/Services/constants';
import { LoadingService } from '../../../pages/Services/loading.service';
import { NbDialogService } from '@nebular/theme';
import { ShowcaseDialogComponent } from '../../../pages/modal-overlays/dialog/showcase-dialog/showcase-dialog.component';
import { ConfirmSelectDialogComponent } from '../../../pages/modal-overlays/dialog/confirm-select-dialog/confirm-select-dialog.component';

@Component({
  selector: 'ngx-clientinfo',
  templateUrl: './clientinfo.component.html',
  styleUrls: ['./clientinfo.component.scss']
})
export class ClientinfoComponent implements OnInit, AfterViewInit {

  clientInfo: ClientClient;

  foods: any[] = [];
  temp: any[] = [];
  selectedFoods: any[] = [];
  mealTypeId: any[] = [];
  submit_selectedFoods: any[] = [];
  submit_clientFoodDetails: any[] = [];
  
  clientForm: FormGroup;

  clientGUID: string;
  showStepper: boolean = false;
  flagSaveDay: number = 0;

  maxDays: number;
  currentCategory: string;

  clientFoodDetails: any[];

  showForm: boolean = false;
  showThanks: boolean = false;
  showFinal: boolean = false;

  gender: string;
  isMetric: boolean = true;

  wasCalculated: boolean = false;

  currentDay: number;

  // conversions
  readonly weightConversionFactor: number = 2.2046; // Lb in a Kg
  readonly feetPerCm: number = 0.0328084; // 3.28084; // Ft in a Meter
  readonly inchesPerFeet: number = 12;

  // calc vars
  readonly maleModifier: number = 5;
  readonly femaleModifier: number = -161;

  // TDEE
  readonly sedentary = 1.15;
  readonly lightExercise = 1.25;
  readonly moderatelyActive = 1.35;
  readonly veryActive = 1.4;
  readonly extremelyActive = 1.725;

  readonly lightIntensity = 5;
  readonly moderateIntensity = 7.5;
  readonly difficultActive = 10;
  readonly intenseIntensity = 12;

  activityList = [
    { name: 'Sedentary - I have a desk job', modifier: this.sedentary },
    { name: 'Light Exercise - Spend most of the day on your feet (e.g. teacher, salesman)', modifier: this.lightExercise },
    { name: 'Moderately Active - Spend most of the day doing some physical activity (e.g. waitress, mailman)', modifier: this.moderatelyActive },
    { name: 'Very Active - Spend most of the day doing heavy physical activity (e.g. bike messenger, carpenter)', modifier: this.veryActive },
    { name: 'Extremely Active - I am a professional athlete', modifier: this.extremelyActive }
  ];

  intensityList = [
    { name: 'Light - I can hold a conversation while working out and do not break a sweat.', modifier: this.lightIntensity },
    { name: 'Moderate - I am breathing hard and challenge myself.', modifier: this.moderateIntensity },
    { name: 'Difficult -  I always break a sweat and have an elevated heart rate. I cannot hold a conversation.', modifier: this.difficultActive },
    { name: 'Intense -  Don\'t talk to to me, don\'t look at me. I am here for a purpose and i might die today.', modifier: this.intenseIntensity }
  ];

  // BMI/BMR/TDEE vars
  bmr: number = 0;
  bmi: number = 0;
  tdee: number = 0;
  // selectedActivityIndex: number = 0;
  businessInfo: any;

  @ViewChild('srchkey', { static: false }) foodSearchInput: ElementRef;

  @ViewChild('stepper', { static: false }) selIndex: ElementRef;



  get age() { return this.clientForm.get('age'); }


  // private _heightCm: any;
  // @Input() set heightCm (value: any){ this._heightCm = value; }
  get heightCm() { return this.clientForm.get('heightCm'); }

  // private _heightFt: any;
  // @Input() set heightFt (value: any){ this._heightFt = value; }
  get heightFt() { return this.clientForm.get('heightFt'); }

  // private _heightIn: any;
  // @Input() set heightIn (value: any){ this._heightIn = value; }
  get heightIn() { return this.clientForm.get('heightIn'); }

  // private _weightKg: any;
  // @Input() set weightKg (value: any){ this._weightKg = value; }
  get weightKg() { return this.clientForm.get('weightKg'); }

  // private _weightLb: any;
  // @Input() set weightLb (value: any){ this._weightLb = value; }
  get weightLb() { return this.clientForm.get('weightLb'); }

  get units() { return this.clientForm.get('units'); }
  get activityLevel() { return this.clientForm.get('activityLevel'); }
  get excerciseLevel() { return this.clientForm.get('excerciseLevel'); }
  get exerciseDays() { return this.clientForm.get('exerciseDays'); }
  get exerciseMins() { return this.clientForm.get('exerciseMins'); }

  constructor(private route: ActivatedRoute,
    private client: ClientClient, private fb: FormBuilder,
    private dialogService: NbDialogService,
    private food: ClientFoodClient, private toast: NbToastrService,
    public load: LoadingService) {
    this.clientGUID = this.route.snapshot.queryParamMap.get('userId');
    this.initForm();
    this.changeUnits('metric');
    this.currentCategory = 'All';
    this.mealTypeId = [0,1,2,3];
  }

  ngOnInit(): void {
    if (this.clientGUID.trim() !== '') {
      this.getClientDetails();
    }
  }

  ngAfterViewInit() {
    // this.setInput();
  }

  initForm() {
    this.clientForm = this.fb.group({
      firstName: this.fb.control('', [Validators.required]),
      lastName: this.fb.control('', [Validators.required]),
      emailAddress: this.fb.control('', [Validators.required, Validators.pattern(EMAIL_PATTERN)]),
      confirmEmail: this.fb.control(''),
      units: this.fb.control(''),
      status: this.fb.control('In progress'),
      isSendInvite: this.fb.control(false),
      maxDays: this.fb.control('1', Validators.required),
      activityLevel: this.fb.control(this.sedentary),
      excerciseLevel: this.fb.control(this.lightIntensity),
      exerciseDays: this.fb.control(1, Validators.compose([Validators.required, Validators.pattern('^[0-7]*$')])),
      exerciseMins: this.fb.control(0, Validators.compose([Validators.required, Validators.pattern('[0-9]{1,3}')])),
      heightCm: this.fb.control(0, Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])),
      heightFt: this.fb.control(0, Validators.compose([Validators.required, Validators.pattern('^[0-7]$')])),
      heightIn: this.fb.control(0, Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])),
      weightKg: this.fb.control(0, Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])),
      weightLb: this.fb.control(0, Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')])),
      age: this.fb.control(0, Validators.compose([Validators.required, Validators.pattern('^[0-9]*$')]))
    });
  }

  changeUnits(units: string) {
    this.isMetric = units === 'metric';
    // tslint:disable-next-line

    this.recalculateForm();
  }

  updateGender(genderVal: string) {
    // tslint:disable-next-line
    this.gender = genderVal;
    this.recalculateForm();
  }

  calculateImperialFromMetric() {
    if (this.clientForm.controls.heightCm.value !== 0) {
      const ft = parseInt(this.clientForm.controls.heightCm.value, 10) * this.feetPerCm;
      const inches = (ft - Math.floor(ft)) * this.inchesPerFeet;

      this.clientForm.controls.heightFt.setValue(Math.floor(ft));
      this.clientForm.controls.heightIn.setValue(Math.round(inches));
    }

    if (this.clientForm.controls.weightKg.value !== 0) {
      this.clientForm.controls.weightLb.setValue(Math.floor(this.clientForm.controls.weightKg.value * this.weightConversionFactor));
    }
  }

  calculateMetricFromImperial() {
    if (this.clientForm.controls.heightFt.value !== 0) {
      const htInches = (this.clientForm.controls.heightFt.value * this.inchesPerFeet + parseInt(this.clientForm.controls.heightIn.value, 10)) / this.inchesPerFeet;
      const htCm = htInches / this.feetPerCm;

      this.clientForm.controls.heightCm.setValue(Math.round(htCm));
    }

    if (this.clientForm.controls.weightLb.value !== 0) {
      this.clientForm.controls.weightKg.setValue(Math.round(this.clientForm.controls.weightLb.value / this.weightConversionFactor));
    }
  }

  recalculateForm() {
    // tslint:disable-next-line 

    if (this.isMetric === true) {
      this.calculateMetricFromImperial();
    }
    else { // imperial
      this.calculateImperialFromMetric(); // make sure we have the imperial value set
    }

    if (this.clientForm.controls.heightCm.value !== 0 && this.clientForm.controls.weightKg.value !== 0) {
      this.calculateBmi();
      this.calculateBmr();
      this.calculateTdee();
    }
    else if (this.clientForm.controls.heightFt.value !== 0 && this.clientForm.controls.weightLb.value !== 0) {
      this.calculateMetricFromImperial();
      this.calculateBmi();
      this.calculateBmr();
      this.calculateTdee();
    }
  }

  calculateBmr() {
    // The Mifflin - St Jeor BMR equation
    const baseBmr = (10 * this.clientForm.controls.weightKg.value) +
      (this.clientForm.controls.heightCm.value * 6.25) -
      (5 * this.clientForm.controls.age.value);
    if (this.gender === 'Male') {
      this.bmr = Math.round(baseBmr + this.maleModifier);
    }
    else {
      this.bmr = Math.round(baseBmr + this.femaleModifier);
    }
  }

  calculateBmi() {
    const heightInM = this.clientForm.controls.heightCm.value / 100;
    this.bmi = parseInt((this.clientForm.controls.weightKg.value / (heightInM * heightInM)).toFixed(2), 10);
  }

  calculateTdee() {
    // tslint:disable-next-line
    const result = this.clientForm.controls.activityLevel.value * this.bmr +
      this.clientForm.controls.exerciseDays.value * this.clientForm.controls.exerciseMins.value
      * parseFloat(this.clientForm.controls.excerciseLevel.value) / 7;
    this.tdee = Math.round(result);
  }

  getClientDetails() {
    this.client.get(this.clientGUID).subscribe(res => {
      this.maxDays = res.data.maxDays;
      this.clientForm.patchValue(res.data);

      this.bmi = res.data.bmi;
      this.bmr = res.data.bmr;
      this.tdee = res.data.tdee;

      this.weightKg.setValue(res.data.weight);
      this.heightCm.setValue(res.data.height);

      if (res.data.gender !== null) {
        const genderString = (res.data.gender === Gender.Male) ? 'Male' : 'Female';
        this.updateGender(genderString);
      }

      const unitString = (res.data.units === UnitOfMeasurement.Metric) ? 'metric' : 'imperial';
      this.changeUnits(unitString);

      this.businessInfo = res.data.registration;
      if (res.data.age !== 0 && res.data.weight !== 0 && res.data.height !== 0) {
        this.showForm = false;
        this.showStepper = true;
        this.getClientFoodDetails();
      }
      else {
        this.showStepper = false;
        this.showForm = true;
      }
    });
  }

 
  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (
      (charCode > 31 && (charCode < 46 || charCode > 57))) {
      return false;
    }
    return true;
  }
  
  saveDay() {
    if (this.checkValidValues()) {
      const d = this.selectedFoods[this.currentDay-1].map(e => {
        return { actualIntake: +e.actualIntake, id: e.id, meal: e.meal };
      });
      const myFoodObject = {
        clientId: this.clientGUID,
        foodList: d,
        day: this.currentDay
      };
      try {
        this.food.create(<CreateClientFoodCommand>myFoodObject).subscribe(response => {
          if (response.succeeded) {
            this.toast.success('', 'Saved successfully');
            this.flagSaveDay = 0;
          }
        });
      } catch (error) {
        this.toast.danger('', Messages.WRONG);
      }
    }
    else {
      this.toast.danger('', 'Please enter valid values for food intake');
    }
  }

  canEdit(food) {
    if(food.actualIntake > 0){
      food.canEdit = !food.canEdit;
      if(food.canEdit === false){
         this.flagSaveDay = 1;
      }
    }
    
  }

  removeFood(food, index) {
    food.selected = !food.selected;
    food.canEdit = false;
    this.selectedFoods[this.currentDay-1].splice(index, 1);
    this.flagSaveDay = 1;
  }

  updateClientInfo() {
    this.recalculateForm();
    if (this.clientForm.controls.age.value === 0) {
      this.toast.danger('', 'Age can not be 0');
    }
    else if (this.clientForm.controls.heightCm.value === 0) {
      this.toast.danger('', 'Height can not be 0');
    }
    else if (this.clientForm.controls.weightKg.value === 0) {
      this.toast.danger('', 'Weight can not be 0');
    }
    else if (this.clientForm.valid) {
      const clientObj = {
        'clientId': this.clientGUID,
        'height': +this.clientForm.controls.heightCm.value,
        'weight': +this.clientForm.controls.weightKg.value,
        'age': +this.clientForm.controls.age.value,
        'gender': this.gender,
        'units': (this.isMetric) ? 'Metric' : 'Imperial',
        'bmr': +this.bmr,
        'bmi': +this.bmi,
        'tdee': +this.tdee,
        'exerciseLevel': +this.clientForm.controls.excerciseLevel.value,
        'activityLevel': +this.clientForm.controls.activityLevel.value
      };

      // tslint:disable-next-line

      try {
        this.food.update(<UpdateClientByUserId>clientObj).subscribe(response => {
          if (response.succeeded) {
            this.toast.success('', 'Details updated successfully');
            this.getClientDetails();
          }
        });
      } catch (error) {
        this.toast.danger('', Messages.WRONG);
      }
    }
    else {
      this.toast.danger('', 'Please enter valid values');
      this.clientForm.markAllAsTouched();
    }
  }

  getClientFoodDetails() {
    try {
      this.food.get(this.clientGUID).subscribe(response => {
        if (response.lists.length > 0) {
          for (let i = 1; i <= 7; i++) {
            this.temp = [];
            response.lists.forEach(e => {
              if (e.day === i) {
                this.temp.push(e);
              }
            });
            if (this.temp.length > 0) {
              this.selectedFoods.push(this.temp);
            }

          }

          if (this.selectedFoods.length === this.maxDays) {
            this.showFinal = true;
            this.showStepper = false;
            this.showThanks = false;
            // this.clientFoodDetails = this.selectedFoods.sort((a, b) => a.day - b.day);
            // this.currentDay = this.selectedFoods?.length;
            // this.showFinal = false;
            // this.showStepper = true;
            // this.showThanks = false;
          
          }
          else {
            this.clientFoodDetails = this.selectedFoods.sort((a, b) => a.day - b.day);
            this.currentDay = this.selectedFoods?.length;

            // tslint:disable-next-line
            console.log('sserver response', response.lists);
            // tslint:disable-next-line
            console.log('client food details', this.getClientDetails);
            // tslint:disable-next-line
            console.log('selectedFoods', this.selectedFoods);
            // tslint:disable-next-line
            console.log('clientFoodDetails', this.clientFoodDetails);
          }
        }else{
            response.lists = [];
            for (let i = 1; i <= 7; i++) {
              this.temp = [];
              response.lists.forEach(e => {
                if (e.day === i) {
                  this.temp.push(e);
                }
              });
              if (this.temp.length > 0) {
                this.selectedFoods.push(this.temp);
              }

            }
            this.selectedFoods.push([]);
            this.clientFoodDetails = this.selectedFoods.sort((a, b) => a.day - b.day);
            this.currentDay = 1;

        }
      });
    } catch (error) {
      this.toast.danger('', Messages.WRONG);
    }
  }

  setDay(day: number) {
    this.currentDay = day;
    this.confirm_modal_open();
    // console.log(this.clientFoodDetails );
    // let newIndex = day -1;
    // console.log("setting index to " + newIndex);
    // this.clientFoodDetails = this.selectedFoods[day];
  }

  submitFoodDetails() {
    // this.submit_selectedFoods = [];
    // this.submit_clientFoodDetails = [];

    // for(let i=0; i<this.selectedFoods.length; i++){
    //   for(let j=0; j<this.selectedFoods[i].length; j++){
    //     this.submit_selectedFoods.push(this.selectedFoods[i][j])
    //   }
    // }

    // for(let i=0; i<this.clientFoodDetails.length; i++){
    //   for(let j=0; j<this.clientFoodDetails[i].length; j++){
    //     this.submit_clientFoodDetails.push(this.clientFoodDetails[i][j])
    //   }
    // }


    if (this.checkValidValues()) {
      const d = this.selectedFoods[this.currentDay-1].map(e => {
        return { actualIntake: +e.actualIntake, id: e.id, meal: e.meal };
      });
      const myFoodObject = {
        clientId: this.clientGUID,
        foodList: d,
        // day: (this.clientFoodDetails.length + 1)
        day: this.currentDay
      };
      try {
        this.food.create(<CreateClientFoodCommand>myFoodObject).subscribe(response => {
          if (response.succeeded) {
            this.showStepper = false;
            this.showThanks = true;
            this.toast.success('', 'Details submitted successfully');
            if (this.clientFoodDetails.length + 1 === this.maxDays) {
              if (this.clientForm.controls.status.value === 'In progress') {
                this.changeStatus('Done');
              }
            }
            this.getClientFoodDetails();
          }
        });
      } catch (error) {
        this.toast.danger('', Messages.WRONG);
      }
    }
    else {
      this.toast.danger('', 'Please enter valid values for food intake');
    }
  }

  changeStatus(status: string) {
    try {
      this.food.update2('test', <UpdateClientStatus>{
        clientId: this.clientGUID,
        status: status
      }).subscribe(response => {
        if (!response.succeeded) {
          this.toast.danger('', 'Error updating status');
        }
      });
    } catch (error) {
      this.toast.danger('', Messages.WRONG);
    }
  }

  checkValidValues(): boolean {
    let a = 0;
    this.selectedFoods[this.currentDay-1].forEach(e => {
      if (isNaN(e.actualIntake) || e.actualIntake <= 0 || e.actualIntake.toString().trim() === '') {
        a++;
      }
    });
    return a > 0 ? false : true;
  }

  checkMealType(value: number): boolean {
    let a = 0;
    if(this.selectedFoods[this.currentDay-1] !== undefined){
      this.selectedFoods[this.currentDay-1].forEach(e => {
        if (e.meal === value) {
          a++;
        }
      });
    }
    
    return a > 0 ? true : false;
  }

  sendAnotherDays() {
    this.showThanks = false;
    this.showStepper = true;
    this.foods = [];
    this.selectedFoods = [];
    this.selIndex['selectedIndex'] = 1;
    this.getClientFoodDetails();
  }
  
  anotherDay() {
    this.confirm_modal_open();
    if(this.selectedFoods.length < 7){
      
      this.currentDay = this.currentDay + 1;
      this.selectedFoods.push([]);

    }
    
  }

  modal_open(foodGroupName: number) {

    this.dialogService.open(ShowcaseDialogComponent, {
      context: {
        title: foodGroupName,
      }
    }).onClose.subscribe(values => values ? values.map(item => this.selectedFoods[this.currentDay-1].push(item), this.flagSaveDay = 1) : '');
    
    

  }

  confirm_modal_open(){
    if(this.flagSaveDay === 1){
       this.dialogService.open(ConfirmSelectDialogComponent).onClose.subscribe(values => this.excute_saveDay(values));
    }
  }

  excute_saveDay(values){
    if(values === true){
      this.saveDay();
    }
  
  }

}
