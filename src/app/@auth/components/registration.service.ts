import { Injectable } from '@angular/core';
import { CreateRegistrationCommand } from '../../Nutricalc-api';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  planDetails: CreateRegistrationCommand = null;

  constructor() { }

  getPlanDetails() {
    return this.planDetails;
  }

  setPlanDetails(plan: CreateRegistrationCommand) {
    this.planDetails = plan;
  }
}
