import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { CreatePaymentCommand, IPlan, PayementsClient, RegistrationClient, UpdateRegistrationCommand } from '../../../Nutricalc-api';
import { Messages } from '../../Services/constants';
import { LoadingService } from '../../Services/loading.service';
import { PlansService } from '../../Services/plans/plans.service';
import { IBusiness, UserService } from '../../Services/user.service';

interface IPlanUpgrade {
  paymentAmount: number;
  newPlanExpiryDate: Date;
  description: string;
  interval: string;
  id: number;
}

@Component({
  selector: 'ngx-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  currentUser: IBusiness;
  paymentForm: FormGroup;
  makePayment: boolean;
  planUpdate: IPlanUpgrade = { description: '', interval: '', newPlanExpiryDate: null, paymentAmount: 0, id: null };

  months: number[];
  years: number[];
  countries: { name: string, code: string };

  get cardNumber() { return this.paymentForm.get('cardNumber'); }
  get cardHolderName() { return this.paymentForm.get('cardHolderName'); }
  get country() { return this.paymentForm.get('country'); }
  get address() { return this.paymentForm.get('address'); }
  get city() { return this.paymentForm.get('city'); }
  get year() { return this.paymentForm.get('year'); }
  get month() { return this.paymentForm.get('month'); }
  get cvv() { return this.paymentForm.get('cvv'); }

  constructor(private plan: PlansService, private route: ActivatedRoute,
    private user: UserService, private router: Router,
    private business: RegistrationClient, private toastService: NbToastrService,
    private payment: PayementsClient, public load: LoadingService,
    private fb: FormBuilder) {
    this.months = [];
    for (let index = 1; index < 13; index++) {
      this.months.push(index);
    }
    this.years = [];
    for (let index = 2020; index < 2100; index++) {
      this.years.push(index);
    }
  }

  initForm() {
    this.paymentForm = this.fb.group({
      cardNumber: this.fb.control('', [Validators.required, Validators.minLength(16), Validators.pattern('^[0-9]*$')]),
      cardHolderName: this.fb.control('', [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
      country: this.fb.control('', Validators.required),
      address: this.fb.control('', Validators.required),
      city: this.fb.control('', Validators.required),
      year: this.fb.control('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      month: this.fb.control('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      cvv: this.fb.control('', [Validators.required, Validators.pattern('^[0-9]*$')])
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.planUpdate.id = +this.route.snapshot.queryParamMap.get('npId');
    this.currentUser = this.user.currentUser$.value;
    if (this.planUpdate.id > 0 && this.planUpdate.id !== this.currentUser.plan) {
      this.calculateNewBillingCycle(this.planUpdate.id);
    }
    else {
      this.router.navigate(['/pages/business/my-account']);
    }
    this.fetchCountriesList();
  }

  fetchCountriesList() {
    try {
      this.load.loadCountries().subscribe(res => {
        if (res && res.length > 0) {
          this.countries = res;
          this.paymentForm.controls.country.setValue(res[0].code);
        }
      });
    } catch (error) {
      this.toastService.danger('', Messages.WRONG);
    }
  }

  /*Cost of new plan - ((Cost of original plan / Days in full period) * Days left in period).
    Up to a maximum of the total subscription cost for that billing period (cannot be negative)*/

  calculateNewBillingCycle(newId) {
    if (newId) {
      this.plan.getPlans().subscribe((response: IPlan[]) => {
        const originalPlan = response.find(e => e.id === this.currentUser.plan);
        const newPlan = response.find(e => e.id === newId);
        this.planUpdate.description = newPlan.description;
        this.planUpdate.interval = newPlan.interval;
        const oneDay = 24 * 60 * 60 * 1000;
        const firstDate = new Date();
        const secondDate = new Date(this.currentUser.planExpiryDate);
        const diffDays = Math.round(Math.abs((secondDate.getTime() - firstDate.getTime()) / oneDay));

        const amount = newPlan.price - ((originalPlan.price / 365) * diffDays);
        // this.currentUser.balance = 130;
        // balance calculations to be managed

        let amountToBePaid = 0;
        if (this.currentUser.balance > 0) {
          amountToBePaid = amount - this.currentUser.balance;
          if (amountToBePaid >= 0) {
            // console.log('current balance is : $0');
            this.currentUser.balance = 0;
          }
          else {
            // console.log('Balance left is : $' + Math.abs(amountToBePaid));
            this.currentUser.balance = Math.abs(amountToBePaid);
            amountToBePaid = 0;
          }
        }
        else {
          amountToBePaid = amount;
        }
        // console.log(this.currentUser.balance);
        // console.log(amountToBePaid);
        this.planUpdate.paymentAmount = Math.floor(amountToBePaid);

        if (amountToBePaid === 0 || amountToBePaid < 0) {
          this.makePayment = false;
          // Billing date will not change
          // this.currentUser.balance = Math.floor(amountToBePaid);
        }
        else if (amountToBePaid > 0) {
          this.makePayment = true;
          this.planUpdate.newPlanExpiryDate = new Date(new Date().getTime() + (364 * 24 * 60 * 60 * 1000));
          // New billing date
        }
      });
    }
  }

  makePlanPayment() {
    // console.log(this.paymentForm.valid);
    if (this.paymentForm.controls.address.value.trim() === '') {
      this.toastService.danger('', 'Address can not be empty');
    }
    else if (this.paymentForm.controls.city.value.trim() === '') {
      this.toastService.danger('', 'City can not be empty');
    }
    else if (this.paymentForm.valid) {
      const obj = {
        'email': this.currentUser.contactEmail,
        'dateCreated': new Date(),
        'cardNumber': this.paymentForm.controls.cardNumber.value.trim(),
        'displayNumber': this.paymentForm.controls.cardNumber.value.trim(),
        'expiryMonth': this.paymentForm.controls.month.value.trim(),
        'expiryYear': this.paymentForm.controls.year.value.trim(),
        'cvv': this.paymentForm.controls.cvv.value.trim(),
        'name': this.paymentForm.controls.cardHolderName.value.trim().replace(/\s\s+/g, ' '),
        'address1': this.paymentForm.controls.address.value.trim().replace(/\s\s+/g, ' '),
        'city': this.paymentForm.controls.city.value.trim().replace(/\s\s+/g, ' '),
        'country': 'AUS',
        'description': this.planUpdate.description,
        'currency': 'AUD',
        'amount': this.planUpdate.paymentAmount,
        'planId': this.planUpdate.id,
        'planExpiryDate': this.planUpdate.newPlanExpiryDate,
        'billedTo': this.paymentForm.controls.cardNumber.value.trim().replace(/(?<=^\d{0,11})\d/g, '*')
      };
      try {
        this.payment.payment(<CreatePaymentCommand>obj).subscribe(resp => {
          if (resp.succeeded) {
            this.updatePlanDetails();
          }
          else if (!resp.succeeded) {
            this.toastService.danger('', resp.errors);
          }
        });
      } catch (error) {
        this.toastService.danger('', Messages.WRONG);
      }
    }
    else {
      this.toastService.danger('', 'Invalid payment details');
      this.paymentForm.markAllAsTouched();
    }
  }

  updatePlanDetails() {
    try {
      const businessData = {
        companyName: this.currentUser.companyName,
        contactEmail: this.currentUser.contactEmail,
        contactFirstName: this.currentUser.contactFirstName,
        contactLastName: this.currentUser.contactLastName,
        contactPhone: this.currentUser.contactPhone,
        id: this.currentUser.id,
        planId: this.planUpdate.id,
        planExpiryDate: null,
        contactOldEmail: this.currentUser.contactEmail,
        balance: this.currentUser.balance
      };
      if (this.makePayment) {
        businessData.planExpiryDate = this.planUpdate.newPlanExpiryDate;
      }
      else {
        businessData.planExpiryDate = this.currentUser.planExpiryDate;
      }
      this.business.update(this.currentUser.id, <UpdateRegistrationCommand>businessData).subscribe(response => {
        if (response.succeeded === true) {
          this.user.changeUserState(
            {
              companyName: businessData.companyName,
              contactEmail: businessData.contactEmail,
              contactFirstName: businessData.contactFirstName,
              contactLastName: businessData.contactLastName,
              contactPhone: businessData.contactPhone,
              id: businessData.id,
              plan: businessData.planId,
              planExpiryDate: businessData.planExpiryDate,
              filePath: this.currentUser.filePath,
              qualification: this.currentUser.qualification,
              websiteUrl: this.currentUser.websiteUrl,
              balance: this.currentUser.balance
            }
          );
          this.toastService.success('', 'Plan has been changed successfully');
          this.router.navigate(['/pages/business/my-account']);
        }
        else {
          this.toastService.danger('', response.errors);
        }
      });
    } catch (error) {
      this.toastService.danger('', Messages.WRONG);
    }
  }
}
