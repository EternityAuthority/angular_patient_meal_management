import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { CreatePaymentCommand, CreateRegistrationCommand, IRegistrationDTO, PayementsClient, RegistrationClient, UpdateRegistrationVerifiedCommand } from '../../../Nutricalc-api';
import { Messages } from '../../../pages/Services/constants';
import { LoadingService } from '../../../pages/Services/loading.service';
import { RegistrationService } from '../registration.service';

@Component({
  selector: 'ngx-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  planDetails: IRegistrationDTO;
  userId: string;
  paymentForm: FormGroup;

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

  constructor(private reg: RegistrationService, private payment: PayementsClient,
    private toastService: NbToastrService, private client: RegistrationClient,
    private router: Router, public load: LoadingService,
    private route: ActivatedRoute, private fb: FormBuilder) {
    this.months = [];
    for (let index = 1; index < 13; index++) {
      this.months.push(index);
    }
    this.years = [];
    for (let index = 2020; index < 2100; index++) {
      this.years.push(index);
    }
  }

  ngOnInit() {
    this.initForm();
    this.userId = this.route.snapshot.queryParamMap.get('userId');
    if (this.userId) {
      this.getBusinessInfo(this.userId);
    }
    this.fetchCountriesList();
  }

  initForm() {
    this.paymentForm = this.fb.group({
      cardNumber: this.fb.control(null, [Validators.required, Validators.minLength(16), Validators.pattern('^[0-9]*$')]),
      cardHolderName: this.fb.control(null, [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]),
      country: this.fb.control('', Validators.required),
      address: this.fb.control(null, Validators.required),
      city: this.fb.control(null, Validators.required),
      year: this.fb.control(null, [Validators.required, Validators.pattern('^[0-9]*$')]),
      month: this.fb.control(null, [Validators.required, Validators.pattern('^[0-9]*$')]),
      cvv: this.fb.control(null, [Validators.required, Validators.pattern('^[0-9]*$')])
    });
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

  getBusinessInfo(userId: string) {
    try {
      this.client.get2('userId', undefined, userId).subscribe(response => {
        this.planDetails = response.data;
        if (response.data && !response.data['isVerified']) {
          if (response.data.plan.price === 0) {
            this.verifyUser();
          } else if (response.data.plan.price > 0) {
            response.data.planExpiryDate = new Date(Date.now() + (364 * 24 * 60 * 60 * 1000));
            this.planDetails = response.data;
          }
        }
        else if (response.data && response.data['isVerified']) {
          this.toastService.info('', 'You are already verified');
          this.router.navigate(['/auth/login']);
        }
      });
    } catch (error) {
      this.toastService.danger('', Messages.WRONG);
    }
  }

  makePlanPayment() {
    if (this.paymentForm.controls.address.value.trim() === '') {
      this.toastService.danger('', 'Address can not be empty');
    }
    else if (this.paymentForm.controls.city.value.trim() === '') {
      this.toastService.danger('', 'City can not be empty');
    }
    else if (this.paymentForm.valid) {
      const obj = {
        'email': this.planDetails.contactEmail,
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
        'description': this.planDetails.plan.description,
        'currency': 'USD',
        'amount': this.planDetails.plan.price,
        'planId': this.planDetails.plan.id,
        'planExpiryDate': this.planDetails.planExpiryDate,
        'billedTo': this.paymentForm.controls.cardNumber.value.trim().replace(/(?<=^\d{0,11})\d/g, '*')
      };
      try {
        this.payment.payment(<CreatePaymentCommand>obj).subscribe(resp => {
          if (resp.succeeded) {
            this.verifyUser();
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

  verifyUser() {
    this.client.verifiedEmail(<UpdateRegistrationVerifiedCommand>{
      userId: this.userId,
      isVerified: true
    }).subscribe(response => {
      if (response) {
        this.toastService.success('Your account has been verifed successfully. Please login now');
        this.router.navigate(['/auth/login']);
      }
    });
  }

}
