import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { CreateFoodCommand, FoodClient, FoodGroupClient, NutrientClient, UpdateFoodCommand } from '../../../../Nutricalc-api';
import { messages } from '../../../extra-components/chat/messages';
import { Messages } from '../../../Services/constants';
import { LoadingService } from '../../../Services/loading.service';

enum Mode {
  EDIT = 'Edit',
  ADD = 'Add',
}

@Component({
  selector: 'ngx-addfood',
  templateUrl: './addfood.component.html',
  styleUrls: ['./addfood.component.scss']
})
export class AddfoodComponent implements OnInit {

  foodForm: FormGroup;
  mode: Mode;
  foodId: number;

  get name() {
    return this.foodForm.get('name');
  }

  get foodGroup() {
    return this.foodForm.get('foodGroup');
  }

  get servingSuggestion() {
      return this.foodForm.get('servingSuggestion');
  }

  foodGroups: Array<object>;

  nutrientsList: Array<object>;

  nutrientsForm: FormGroup;
  nutrients: FormArray;

  constructor(private fb: FormBuilder, private route: ActivatedRoute,
    private router: Router, private fd: FoodClient, private toastrService: NbToastrService,
    private fg: FoodGroupClient, private nutrient: NutrientClient,
    public load: LoadingService) {
    this.initForm();
    this.foodId = +this.route.snapshot.paramMap.get('Id');
    if (this.foodId) {
      this.mode = Mode.EDIT;
    } else {
      this.mode = Mode.ADD;
    }
  }

  initForm(flag?) {
    this.foodForm = this.fb.group({
      name: this.fb.control('', [Validators.required, Validators.minLength(1), Validators.maxLength(250)]),
      foodGroup: this.fb.control(null, [Validators.required]),
        servingSuggestion: this.fb.control('0', [Validators.required, Validators.maxLength(250)])
    });
    this.nutrientsForm = this.fb.group({
      nutrients: this.fb.array([])
    });
    if (flag) {
      this.foodForm.controls.foodGroup.setValue(this.foodGroups[0]['id']);
    }
  }

  createItem(data?) {
    if (data) {
      try {
        return this.fb.group({
          id: [data.nutrient.id, [Validators.required, Validators.pattern('^[0-9.]*$')]],
          value: [data.value, [Validators.required, Validators.pattern('^[0-9.]*$')]]
        });

      } catch (error) {
        // console.log(error);
      }
    }
    else {
      return this.fb.group({
        id: [null, [Validators.required, Validators.pattern('^[0-9.]*$')]],
        value: [0, [Validators.required, Validators.pattern('^[0-9.]*$')]]
      });
    }
  }

  addNutrient(data?) {
    try {
      this.nutrients = this.nutrientsForm.get('nutrients') as FormArray;
      if (this.nutrients.length === this.nutrientsList.length) {
        this.toastrService.danger('', 'You can not add more nutrients');
      }
      else {
        if (data) {
          this.nutrients.push(this.createItem(data));
        }
        else {
          this.nutrients.push(this.createItem());
        }
      }
    } catch (error) {
      // console.log(error);
    }
  }

  removeNutrient(index, nv) {
    this.nutrients = this.nutrientsForm.get('nutrients') as FormArray;
    this.nutrients.removeAt(index);
  }

  ngOnInit(): void {
    this.getFoodGroupsList();
    this.getNutrientsList();
    if (this.foodId) {
      this.getFoodData(this.foodId);
    }
  }

  createNutrients(data: Array<object>) {
    data.forEach(e => {
      this.addNutrient(e);
    });
  }

  getFoodData(id: number) {
    try {
      this.fd.get2(id).subscribe(response => {
        if (response.data != null) {
          this.foodForm.patchValue(response.data);
          this.foodForm.controls.foodGroup.setValue(response.data.foodGroup.id);
          if (response.data.nutrients.length > 0) {
            this.createNutrients(response.data.nutrients);
          }
        }
        else {
          this.router.navigate(['/pages/admin/**']);
        }
      });
    } catch (error) {
      this.toastrService.danger('', Messages.WRONG);
    }
  }

  getFoodGroupsList() {
    try {
      this.fg.get().subscribe(resp => {
        if (resp) {
          this.foodGroups = resp['lists'];
          this.foodForm.controls.foodGroup.setValue(this.foodGroups[0]['id']);
        }
      });
    } catch (error) {
      this.toastrService.danger('', Messages.WRONG);
    }
  }

  getNutrientsList() {
    try {
      this.nutrient.get().subscribe(resp => {
        if (resp) {
          this.nutrientsList = resp['lists'];
        }
      });
    } catch (error) {
      this.toastrService.danger('', Messages.WRONG);
    }
  }

  save() {
    this.foodId ? this.editFood() : this.createFood();
  }

  onItemSelect($event, nutrientControl) {
    // console.log(this.nutrients.controls.map(e => e.value.id));
    const eD = this.nutrients.controls.map(e => e.value.id);
    const nutrientData = eD.filter(e => e === $event);
    // console.log(nutrientData);
    if (nutrientData.length > 1) {
      this.toastrService.danger('', 'Nutrient already exists');
      nutrientControl.controls.id.setValue(null);
    }
  }

  validateServings(): number {
    try {
        if (this.foodForm.controls.servingSuggestion.value.trim() === '' ) {
        return 1;
      }
      // else if (isNaN(this.foodForm.controls.servingSuggestionSmall.value) || isNaN(this.foodForm.controls.servingSuggestionMedium.value) ||
      //   isNaN(this.foodForm.controls.servingSuggestionLarge.value)) {
      //   return 2;
      // }
      // else if (parseInt(this.foodForm.controls.servingSuggestionSmall.value) < 0 || (this.foodForm.controls.servingSuggestionMedium.value) < 0
      //   || (this.foodForm.controls.servingSuggestionLarge.value) < 0) {
      //   return 3;
      // }
      else if (this.foodForm.controls.name.value.trim() === '') {
        return 2;
      }
      // else if (this.foodForm.controls.servingSuggestionSmall.value.trim() === "" || this.foodForm.controls.servingSuggestionMedium.value.trim() === ""
      //   || this.foodForm.controls.servingSuggestionLarge.value.trim() === "") {
      //   return 4;
      // }
      else {
        return 3;
      }
    } catch (error) {
      // console.log(error);
    }
  }

  createFood() {
    if (this.foodForm.valid) {
      if (this.nutrients && this.nutrients.length > 0 && !this.nutrientsForm.valid) {
        this.toastrService.danger('', 'Please enter valid nutrients information');
      }
      else if (this.foodForm.controls.name.value.trim() === '') {
        this.toastrService.danger('', Messages.EMPTY_NAME);
      }
      else {
        // console.log(this.validateServings());
        // const retType = this.validateServings();
        // if (retType === 2) {
        //   this.toastrService.danger('', 'Please enter numeric values for servings');
        // }
        // else if (retType === 3) {
        //   this.toastrService.danger('', 'Servings value should not be negative');
        // }
        // if (retType === 1) {
        //   this.toastrService.danger('', 'Serving values can not be blank');
        // }
        // else if (retType === 2) {
        //   this.toastrService.danger('', Messages.EMPTY_NAME);
        // }
        // else if (retType === 3) {
        try {
          this.fd.create(<CreateFoodCommand>{
            foodGroupId: this.foodForm.controls.foodGroup.value,
            name: this.foodForm.controls.name.value.trim(),
              servingSuggestion: this.foodForm.controls.servingSuggestion.value.trim(),
            nutrients: this.nutrientsForm.controls.nutrients.value.length > 0 ? this.nutrientsForm.controls.nutrients.value : []
          }).subscribe(response => {
            if (response.succeeded === true) {
              this.toastrService.success('', 'Food ' + Messages.CREATED);
              this.initForm(1);
            }
            else {
              this.toastrService.danger('', response.errors);
            }
          });
        } catch (error) {
          this.toastrService.danger('', Messages.WRONG);
        }
        // }
      }
    }
    else {
      this.toastrService.danger('', 'Please enter valid food information');
    }
  }

  editFood() {
    if (this.foodForm.valid) {
      if (this.nutrients && this.nutrients.length > 0 && !this.nutrientsForm.valid) {
        this.toastrService.danger('', 'Please enter valid nutrients information');
      }
      else if (this.foodForm.controls.name.value.trim() === '') {
        this.toastrService.danger('', Messages.EMPTY_NAME);
      }
      else {
        // const retType = this.validateServings();
        // if (retType === 1) {
        //   this.toastrService.danger('', 'Please enter numeric values for servings');
        // }
        // else if (retType === 2) {
        //   this.toastrService.danger('', 'Servings value should not be negative');
        // }
        // else if (retType === 3) {
        //   this.toastrService.danger('', 'Name can not be blank');
        // }
        // else if (retType === 5) {
        try {
          this.fd.update(this.foodId, <UpdateFoodCommand>{
            id: this.foodId,
            foodGroupId: this.foodForm.controls.foodGroup.value,
            name: this.foodForm.controls.name.value.trim(),
              servingSuggestion: this.foodForm.controls.servingSuggestion.value.trim(),
            nutrients: this.nutrientsForm.controls.nutrients.value.length > 0 ? this.nutrientsForm.controls.nutrients.value : []
          }).subscribe(response => {
            if (response.succeeded === true) {
              this.toastrService.success('', 'Food ' + Messages.EDITED);
            }
            else {
              this.toastrService.danger('', response.errors);
            }
          });
        } catch (error) {
          this.toastrService.danger('', Messages.WRONG);
        }
      }
      // }
    }
    else {
      this.toastrService.danger('', 'Please enter valid food information');
    }
  }

  back() {
    this.router.navigate(['/pages/admin/foods-list']);
  }

}
