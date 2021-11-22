import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { EMAIL_PATTERN } from '../../../@auth/components';
import { ClientClient, FileUploadClient, IPlan, RegistrationClient, UpdateRegistrationCommand } from '../../../Nutricalc-api';
import { ConfirmationComponent } from '../../dialogs/confirmation/confirmation.component';
import { Messages } from '../../Services/constants';
import { LoadingService } from '../../Services/loading.service';
import { PlansService } from '../../Services/plans/plans.service';
import { UserService } from '../../Services/user.service';

@Component({
  selector: 'ngx-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss']
})
export class MyAccountComponent implements OnInit {

  businessForm: FormGroup;

  plans$: IPlan[];

  currentPlanId: number;

  get companyName() { return this.businessForm.get('companyName'); }

  get contactFirstName() { return this.businessForm.get('contactFirstName'); }

  get contactLastName() { return this.businessForm.get('contactLastName'); }

  get contactPhone() { return this.businessForm.get('contactPhone'); }

  get contactEmail() { return this.businessForm.get('contactEmail'); }

  get password() { return this.businessForm.get('password'); }

  get websiteUrl() { return this.businessForm.get('websiteUrl'); }

  get qualification() { return this.businessForm.get('qualification'); }

  constructor(private business: RegistrationClient, private user: UserService,
    private fb: FormBuilder, private toastrService: NbToastrService,
    public load: LoadingService, private plan: PlansService,
    private dialogService: NbDialogService,
    private router: Router, private client: ClientClient,
    private file: FileUploadClient) {
    this.initForm();
  }

  initForm() {
    this.businessForm = this.fb.group({
      id: this.fb.control(null),
      planId: this.fb.control(null, [Validators.required]),
      companyName: this.fb.control('', [Validators.required, Validators.minLength(1), Validators.maxLength(250)]),
      contactFirstName: this.fb.control('', [Validators.required]),
      contactLastName: this.fb.control('', [Validators.required]),
      contactPhone: this.fb.control('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      contactEmail: this.fb.control('', [Validators.required, Validators.pattern(EMAIL_PATTERN)]),
      planExpiryDate: this.fb.control(null),
      contactOldEmail: this.fb.control(null),
      websiteUrl: this.fb.control(''),
      qualification: this.fb.control(''),
      photoPath: this.fb.control(null),
      balance: (0)
    });
  }

  ngOnInit() {
    this.plan.getPlans().subscribe(response => {
        this.plans$ = response.sort((a, b) => a.maxCustomers - b.maxCustomers);
    });
    if (!this.user.getUser()) {
      this.getBusinessInfo();
    }
    else {
      this.user.currentUser$.subscribe(user => {
        if (user) {
          this.businessForm.patchValue(user);
          this.businessForm.controls.planId.setValue(user.plan);
          this.businessForm.controls.planExpiryDate.setValue(user.planExpiryDate);
          this.businessForm.controls.contactOldEmail.setValue(user.contactEmail);
          this.currentPlanId = user.plan;
          this.businessForm.controls.photoPath.setValue(user.filePath);
        }
      });
    }
  }

  getBusinessInfo() {
    try {
      const user = JSON.parse(atob(localStorage.getItem('myAuthDetail')));
      if (user) {
        this.business.get2('userId', undefined, user.userId).subscribe(response => {
          if (response) {
            this.user.setUser({
              companyName: response.data.companyName,
              contactEmail: response.data.contactEmail,
              contactFirstName: response.data.contactFirstName,
              contactLastName: response.data.contactLastName,
              contactPhone: response.data.contactPhone,
              id: response.data.id,
              plan: response.data.plan.id,
              planExpiryDate: response.data.planExpiryDate,
              filePath: response.data.photoPath,
              qualification: response.data.qualification,
              websiteUrl: response.data.websiteUrl,
              balance: response.data.balance
            });
            this.businessForm.patchValue(response.data);
            this.businessForm.controls.planId.setValue(response.data.plan.id);
            this.businessForm.controls.planExpiryDate.setValue(response.data.planExpiryDate);
            this.currentPlanId = response.data.plan.id;
            this.businessForm.controls.contactOldEmail.setValue(response.data.contactEmail);
          }
        });
      }
    } catch (error) {
      this.toastrService.danger('', Messages.WRONG);
    }
  }

  saveDetails() {
    if (this.businessForm.valid) {
      if (this.businessForm.controls.companyName.value.trim() === '') {
        this.toastrService.danger('Company name can not be blank');
      }
      else if (this.businessForm.controls.contactFirstName.value.trim() === '') {
        this.toastrService.danger('First name can not be blank');
      }
      else if (this.businessForm.controls.contactLastName.value.trim() === '') {
        this.toastrService.danger('Last name can not be blank');
      }
      else {
        try {
          const businessData = this.businessForm.value;
          businessData.filePath = this.businessForm.controls.photoPath.value ? this.businessForm.controls.photoPath.value : '';
          businessData.websiteUrl = this.businessForm.controls.websiteUrl.value ? this.businessForm.controls.websiteUrl.value.trim() : '';
          businessData.qualification = this.businessForm.controls.qualification.value ? this.businessForm.controls.qualification.value.trim() : '';
          this.business.update(this.businessForm.controls.id.value, <UpdateRegistrationCommand>businessData).subscribe(response => {
            if (response.succeeded === true) {
              this.user.changeUserState({
                companyName: this.businessForm.controls.companyName.value ? this.businessForm.controls.companyName.value.trim() : '',
                contactEmail: this.businessForm.controls.contactEmail.value ? this.businessForm.controls.contactEmail.value.trim() : '',
                contactFirstName: this.businessForm.controls.contactFirstName.value ? this.businessForm.controls.contactFirstName.value.trim() : '',
                contactLastName: this.businessForm.controls.contactLastName.value ? this.businessForm.controls.contactLastName.value.trim() : '',
                contactPhone: this.businessForm.controls.contactPhone.value ? this.businessForm.controls.contactPhone.value.trim() : '',
                id: this.businessForm.controls.id.value,
                plan: this.businessForm.controls.planId.value,
                planExpiryDate: this.businessForm.controls.planExpiryDate.value,
                filePath: this.businessForm.controls.photoPath.value,
                qualification: this.businessForm.controls.qualification.value ? this.businessForm.controls.qualification.value.trim() : '',
                websiteUrl: this.businessForm.controls.websiteUrl.value ? this.businessForm.controls.websiteUrl.value.trim() : '',
                balance: this.businessForm.controls.balance.value
              });
              this.toastrService.success('', 'Business ' + Messages.EDITED);
            }
            else {
              this.toastrService.danger('', response.errors);
            }
          });
        } catch (error) {
          this.toastrService.danger('', Messages.WRONG);
        }
      }
    }
    else {
      this.toastrService.info('', 'Please enter valid details');
      this.businessForm.markAllAsTouched();
    }
  }

  getPlanName(): string {
    if (this.plans$ && this.plans$.length > 0) {
      const obj = this.plans$.find(e => e.id === this.currentPlanId);
      return obj ? obj.description : '';
    }
  }

  getDate(flag, val?) {
    const d = new Date(this.businessForm.controls.planExpiryDate.value);
    if (flag === 1 && d) {
      return this.transToDate(new Date(d.getTime() - (364 * 24 * 60 * 60 * 1000)));
    }
    else if (flag === 2 && d) {
      return this.transToDate(new Date(d.getTime() + (1 * 24 * 60 * 60 * 1000)));
    }
    else if (flag === 3) {
      return this.transToDate(val);
    }
  }

  transToDate(date) {
    if (date) {
      const dp = new DatePipe('en-US');
      date = dp.transform(date, 'dd.MM.yyyy');
      return date;
    }
  }

  async getClientCount(plan: IPlan) {
    this.client.getClientsForBusiness(this.businessForm.controls.id.value).subscribe(r => {
      const count = r.lists.length;
      if (count >= 0) {
        this.checkPlanValidation(plan, count);
      }
    }
    );
  }

  async checkPlanValidation(plan: IPlan, count) {
    const currentPlan = this.plans$.filter(e => e.id === this.currentPlanId)[0];
      if (currentPlan && count && count > plan.maxCustomers) {
      this.openDialog('You can not switch to this plan', 2);
    }
    else {
      this.openDialog('change your current plan', 1, plan.id);
    }
  }

  openDialog(title: string, flag, planId?) {
    this.dialogService.open(ConfirmationComponent, {
      context: {
        title: title,
        flag: flag
      },
      autoFocus: false
    })
      .onClose.subscribe(response => {
        if (response === 'yes') {
          this.router.navigate(['/pages/business/payment'],
            {
              queryParams: {
                'npId': planId
              }
            });
        }
      });
  }

  uploadImage(event, file) {
    if (event.target.files[0] && (event.target.files[0].type === 'image/jpeg' ||
      event.target.files[0].type === 'image/jpg' ||
      event.target.files[0].type === 'image/png')
      && this.businessForm.valid) {
      if (this.businessForm.controls.companyName.value.trim() === '') {
        this.toastrService.danger('Company name can not be blank');
      }
      else if (this.businessForm.controls.contactFirstName.value.trim() === '') {
        this.toastrService.danger('First name can not be blank');
      }
      else if (this.businessForm.controls.contactLastName.value.trim() === '') {
        this.toastrService.danger('Last name can not be blank');
      }
      else {
        this.file.upload({ data: event.target.files[0], fileName: event.target.files[0].name }).subscribe(response => {
          if (response) {
            this.businessForm.controls.photoPath.setValue(response);
            this.saveDetails();
          }
        });
      }
    }
    else {
      if (!this.businessForm.valid) {
        this.businessForm.markAllAsTouched();
        this.toastrService.info('', 'Please enter valid details');
      }
      else {
        this.toastrService.danger('', 'Invalid file');
      }
    }
    file.value = '';
  }

}
