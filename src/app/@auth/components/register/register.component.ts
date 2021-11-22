import { DatePipe } from '@angular/common';
/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { CreateRegistrationCommand, PlanClient, RegistrationClient } from '../../../Nutricalc-api';
import { ConfirmationComponent } from '../../../pages/dialogs/confirmation/confirmation.component';
import { Messages } from '../../../pages/Services/constants';
import { LoadingService } from '../../../pages/Services/loading.service';
import { EMAIL_PATTERN, PASSWORD_PATTERN } from '../constants';
import { RegistrationService } from '../registration.service';

@Component({
  selector: 'ngx-register',
  styleUrls: ['./register.component.scss'],
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxRegisterComponent implements OnInit {

  businessForm: FormGroup;
  businessPlans: Array<object>;
  submitted: boolean = false;

  get companyName() { return this.businessForm.get('companyName'); }

  get contactFirstName() { return this.businessForm.get('contactFirstName'); }

  get contactLastName() { return this.businessForm.get('contactLastName'); }

  get contactPhone() { return this.businessForm.get('contactPhone'); }

  get contactEmail() { return this.businessForm.get('contactEmail'); }

  get confirmEmail() { return this.businessForm.get('confirmEmail'); }

  get password() { return this.businessForm.get('password'); }

  get confirmPassword() { return this.businessForm.get('confirmPassword'); }

  constructor(private fb: FormBuilder, private client: RegistrationClient,
    private toastrService: NbToastrService, private plans: PlanClient,
    private router: Router, public load: LoadingService,
    private reg: RegistrationService, private dialog: NbDialogService) {
    this.initForm();
  }

  initForm() {
    this.businessForm = this.fb.group({
      planId: this.fb.control(null, [Validators.required]),
      companyName: this.fb.control('', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]),
      contactFirstName: this.fb.control('', [Validators.required]),
      contactLastName: this.fb.control('', [Validators.required]),
      contactPhone: this.fb.control('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      contactEmail: this.fb.control('', [Validators.required, Validators.pattern(EMAIL_PATTERN)]),
      confirmEmail: this.fb.control(''),
      password: this.fb.control('', [Validators.required, Validators.pattern(PASSWORD_PATTERN)]),
      confirmPassword: this.fb.control('')
    });
  }

  ngOnInit(): void {
    this.getPlansList();
  }

  getPlansList() {
    try {
      this.plans.get().subscribe(response => {
        if (response) {
          this.businessPlans = response['lists'];
          this.businessForm.controls.planId.setValue(this.businessPlans[0]['id']);
          // const regDetails = this.reg.getPlanDetails();
          // if (regDetails) {
          //   this.businessForm.patchValue(regDetails)
          // }
        }
      });
    } catch (error) {
      this.toastrService.danger('', Messages.WRONG);
    }
  }

  openDialog(businessData) {
    this.dialog.open(ConfirmationComponent, {
      context: {
        title: 'submit these details',
        flag: 1
      },
      autoFocus: false
    })
      .onClose.subscribe(sts => {
        if (sts === 'yes') {
          // this.checkForPayment(businessData);
          this.submitDetails(businessData);
        }
      });
  }

  checkForPayment(businessData) {
    const plan = this.businessPlans.find(e => e['id'] === this.businessForm.controls.planId.value);
    if (plan && plan['price'] > 0) {
      // this.reg.setPlanDetails(businessData);
      this.router.navigate([`/auth/payment`]);
    }
    else if (plan && plan['price'] === 0) {
      // this.submitDetails();
    }
  }

  createBusiness() {
    if (this.businessForm.valid && (this.businessForm.controls.password.value === this.businessForm.controls.confirmPassword.value)
      && (this.businessForm.controls.contactEmail.value === this.businessForm.controls.confirmEmail.value)) {
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
        const businessData = this.businessForm.value;
        businessData.balance = 0;
        businessData.password = this.businessForm.controls.password.value.trim();
        const planDetails = this.businessPlans.find(e => e['id'] === this.businessForm.controls.planId.value);
        if (planDetails['interval'] === 'Yearly') {
          businessData.planExpiryDate = this.transToDate(new Date(Date.now() + (364 * 24 * 60 * 60 * 1000)));
          businessData.description = planDetails['description'];
          businessData.interval = planDetails['interval'];
          businessData.price = planDetails['price'];
        }
        this.openDialog(businessData);
      }
    }
    else {
      this.toastrService.danger('', 'Please provide valid details');
    }
  }

  submitDetails(businessData) {
    try {
      this.client.create(<CreateRegistrationCommand>businessData).subscribe(response => {
        if (response.succeeded === true) {
          this.submitted = false;
          this.toastrService.success('', 'Business registration successfull');
          this.initForm();
          this.businessForm.controls.planId.setValue(this.businessPlans[0]['id']);
          // this.router.navigate(['/login']);
          this.openDialog2();
        }
        else {
          this.submitted = false;
          this.toastrService.danger('', response.errors);
        }
      });
    } catch (error) {
      this.toastrService.danger('', Messages.WRONG);
    }
  }

  openDialog2() {
    this.dialog.open(ConfirmationComponent, {
      context: {
        title: 'A verification email has been sent to your registered email address.',
        flag: 2
      },
      autoFocus: false
    })
      .onClose.subscribe(sts => { });
  }

  // For converting date to differnt format
  transToDate(date) {
    if (date) {
      const dp = new DatePipe('en-US');
      date = dp.transform(date, 'yyyy-MM-dd');
      return date;
    }
  }


}
