import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { EMAIL_PATTERN } from '../../../../@auth/components';
import { PlanClient, RegistrationClient, UpdateRegistrationCommand } from '../../../../Nutricalc-api';
import { Messages } from '../../../Services/constants';
import { LoadingService } from '../../../Services/loading.service';

enum Mode {
  EDIT = 'Edit',
  ADD = 'Add',
}

@Component({
  selector: 'ngx-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {

  businessForm: FormGroup;
  mode: Mode;
  clientId: string;

  businessPlans: Array<object>;

  get companyName() { return this.businessForm.get('companyName'); }

  get contactFirstName() { return this.businessForm.get('contactFirstName'); }

  get contactLastName() { return this.businessForm.get('contactLastName'); }

  get contactPhone() { return this.businessForm.get('contactPhone'); }

  get contactEmail() { return this.businessForm.get('contactEmail'); }

  get password() { return this.businessForm.get('password'); }

  get planExpiryDate() { return this.businessForm.get('planExpiryDate'); }

  constructor(private fb: FormBuilder, private route: ActivatedRoute,
    private router: Router, private client: RegistrationClient,
    private toastrService: NbToastrService, private plans: PlanClient,
    public load: LoadingService) {
    this.initForm();
    this.clientId = this.route.snapshot.paramMap.get('Id');
    if (this.clientId) {
      this.mode = Mode.EDIT;
    } else {
      this.mode = Mode.ADD;
    }
  }

  initForm() {
    this.businessForm = this.fb.group({
      planId: this.fb.control(null, [Validators.required]),
      planExpiryDate: this.fb.control(null, [Validators.required]),
      companyName: this.fb.control('', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]),
      contactFirstName: this.fb.control('', [Validators.required]),
      contactLastName: this.fb.control('', [Validators.required]),
      contactPhone: this.fb.control('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      contactEmail: this.fb.control('', [Validators.required, Validators.pattern(EMAIL_PATTERN)]),
      id: this.fb.control(this.clientId),
      contactOldEmail: this.fb.control(null),
      balance: this.fb.control(0)
    });
  }

  ngOnInit(): void {
    if (this.clientId) {
      this.getPlansList();
      this.getClientData(this.clientId);
    }
  }

  getPlansList() {
    try {
      this.plans.get().subscribe(response => {
        if (response) {
          this.businessPlans = response['lists'];
          this.businessForm.controls.planId.setValue(this.businessPlans[0]['id']);
        }
      });
    } catch (error) {
      this.toastrService.danger('', Messages.WRONG);
    }
  }

  getClientData(id: string) {
    try {
      this.client.get2('id', id, undefined).subscribe(response => {
        if (response.data != null) {
          this.businessForm.patchValue(response.data);
          this.businessForm.controls.planId.setValue(response.data.plan.id);
          this.businessForm.controls.contactOldEmail.setValue(response.data.contactEmail);
        }
        else {
          this.router.navigate(['/pages/admin/**']);
        }
      });
    } catch (error) {
      this.toastrService.danger('', Messages.WRONG);
    }
  }

  save() {
    this.clientId ? this.editClient() : this.createClient();
  }

  createClient() {
    // if (this.clientForm.valid) {
    //   try {
    //     this.client.create(<CreateClientRegistrationCommand>{
    //       businessName: this.clientForm.controls.businessName.value,
    //       contactFirstName: this.clientForm.controls.contactFirstName.value,
    //       contactLastName: this.clientForm.controls.contactLastName.value,
    //       contactNumber: this.clientForm.controls.contactNumber.value,
    //       contactEmail: this.clientForm.controls.contactEmail.value,
    //       planId: 1,
    //       planExpiryDate: new Date()
    //     }).subscribe(response => {
    //       if (response) {
    //         this.toastrService.success('', 'Client created successfully');
    //       }
    //     });
    //   } catch (error) {
    //     this.toastrService.danger('', 'Something went wrong');
    //   }
    // }
  }

  editClient() {
    if (this.businessForm.valid) {
      const businessData = this.businessForm.value;
      businessData.planExpiryDate = this.transToDate(this.businessForm.controls.planExpiryDate.value);
      try {
        this.client.update(this.clientId, <UpdateRegistrationCommand>this.businessForm.value)
          .subscribe(response => {
            if (response.succeeded === true) {
              this.toastrService.success('', 'Client ' + Messages.EDITED);
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

  // For converting date to differnt format
  transToDate(date) {
    if (date) {
      const dp = new DatePipe('en-US');
      date = dp.transform(date, 'yyyy-MM-dd');
      return date;
    }
  }

  back() {
    this.router.navigate(['/pages/admin/clients-list']);
  }

}
