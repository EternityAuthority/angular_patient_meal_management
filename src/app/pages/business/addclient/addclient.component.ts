import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { EMAIL_PATTERN } from '../../../@auth/components';
import { ClientClient, ClientFoodClient, RegistrationClient, UpdateClientCommand, UpdateClientStatus } from '../../../Nutricalc-api';
import { ConfirmationComponent } from '../../dialogs/confirmation/confirmation.component';
import { Messages } from '../../Services/constants';
import { LoadingService } from '../../Services/loading.service';
import { PlansService } from '../../Services/plans/plans.service';
import { IBusiness, UserService } from '../../Services/user.service';

enum Mode {
  EDIT = 'Edit',
  ADD = 'Add',
}

@Component({
  selector: 'ngx-addclient',
  templateUrl: './addclient.component.html',
  styleUrls: ['./addclient.component.scss']
})
export class AddclientComponent implements OnInit {

  clientForm: FormGroup;
  clientId: string;
  mode: Mode;
  businessId: string;
  businessInfo: IBusiness;
  currentClientCount: number;

  currentMaxDays: number;

  get firstName() { return this.clientForm.get('firstName'); }

  get lastName() { return this.clientForm.get('lastName'); }

  get emailAddress() { return this.clientForm.get('emailAddress'); }

  get confirmEmail() { return this.clientForm.get('confirmEmail'); }

  get gender() { return this.clientForm.get('gender'); }

  get age() { return this.clientForm.get('age'); }

  get height() { return this.clientForm.get('height'); }

  get weight() { return this.clientForm.get('weight'); }

  constructor(private fb: FormBuilder, private toastrService: NbToastrService,
    public load: LoadingService, private route: ActivatedRoute,
    private client: ClientClient, private user: UserService,
    private dialogService: NbDialogService, private registrationClient: RegistrationClient,
    private plan: PlansService, private food: ClientFoodClient) {
    this.businessInfo = this.user.currentUser$.value;
    this.businessId = this.businessInfo.id;
  }

  async ngOnInit() {
    this.initForm();
    this.clientId = this.route.snapshot.paramMap.get('Id');
    if (this.clientId) {
      this.mode = Mode.EDIT;
      this.getClientData(this.clientId);
    }
    else {
      this.mode = Mode.ADD;
    }
  }

  initForm() {
    this.clientForm = this.fb.group({
      firstName: this.fb.control('', [Validators.required]),
      lastName: this.fb.control('', [Validators.required]),
      emailAddress: this.fb.control('', [Validators.required, Validators.pattern(EMAIL_PATTERN)]),
      confirmEmail: this.fb.control(''),
      status: this.fb.control('In progress'),
      isSendInvite: this.fb.control(false),
      maxDays: this.fb.control('1', Validators.required),
      gender: this.fb.control(''),
      height: this.fb.control(0, Validators.pattern('^[0-9]*$')),
      weight: this.fb.control(0, Validators.pattern('^[0-9]*$')),
      age: this.fb.control(0, Validators.pattern('^[0-9]*$'))
    });
  }

  getClientData(id) {
    try {
      this.client.get(id).subscribe(response => {
        if (response.data) {
          this.clientForm.patchValue(response.data);
          this.clientForm.controls.age.patchValue(response.data.age.toString());
          this.clientForm.controls.weight.patchValue(response.data.weight.toString());
          this.clientForm.controls.height.patchValue(response.data.height.toString());
          this.clientForm.controls.maxDays.patchValue(response.data.maxDays.toString());
          this.currentMaxDays = response.data.maxDays;
        }
      });
    } catch (error) {
      this.toastrService.danger('', Messages.WRONG);
    }
  }

  saveData() {
    this.clientId ? this.editClient() : this.createClient();
  }

  async createClient() {
    await this.getClientsList(this.businessId);
    const status = await this.canAddClient(this.currentClientCount);
    if (status) {
      if (this.clientForm.valid) {
        if (this.clientForm.controls.firstName.value.trim() === '') {
          this.toastrService.info('', 'First Name can not be blank');
        }
        else if (this.clientForm.controls.lastName.value.trim() === '') {
          this.toastrService.info('', 'Last Name can not be blank');
        }
        else if (this.clientForm.controls.emailAddress.value !== this.clientForm.controls.confirmEmail.value) {
          this.toastrService.info('', 'Email and confirm email should be same');
        }
        else {
          try {
            const clientObj = this.clientForm.value;
            clientObj.businessId = this.businessId;
            clientObj.firstName = clientObj.firstName.trim();
            clientObj.lastName = clientObj.lastName.trim();
            clientObj.maxDays = +clientObj.maxDays;
            this.client.create(clientObj).subscribe(response => {
              if (response.succeeded === true) {
                this.openDialog(response.data);
                this.initForm();
                this.toastrService.success('', 'Client ' + Messages.CREATED);
              }
              else if (response.succeeded === false) {
                this.toastrService.info('', response.errors);
              }
            });
          } catch (error) {
            this.toastrService.danger('', Messages.WRONG);
          }
        }
      }
      else {
        this.toastrService.danger('', 'Please enter valid details');
      }
    }
    else {
      this.toastrService.danger('You have added maximum number of clients as per your plan', 'Maximum limit reached');
    }
  }

  editClient() {
    if (this.clientForm.valid) {
      if (this.clientForm.controls.firstName.value.trim() === '') {
        this.toastrService.info('', 'First Name can not be blank');
      }
      else if (this.clientForm.controls.lastName.value.trim() === '') {
        this.toastrService.info('', 'Last Name can not be blank');
      }
      else {
        try {
          if (this.clientForm.controls.status.value === 'Done' && this.currentMaxDays < this.clientForm.controls.maxDays.value) {
            // console.log('status to be set in progress');
            this.clientForm.controls.status.setValue('In progress');
          }
          const clientObj: UpdateClientCommand = this.clientForm.value;
          clientObj.businessId = this.businessId;
          clientObj.firstName = clientObj.firstName.trim();
          clientObj.lastName = clientObj.lastName.trim();
          clientObj.id = this.clientId;
          clientObj.age = this.clientForm.controls.age.value ? +this.clientForm.controls.age.value.trim() : 0;
          clientObj.maxDays = +clientObj.maxDays;
          clientObj.weight = this.clientForm.controls.weight.value ? +this.clientForm.controls.weight.value.trim() : 0;
          clientObj.height = this.clientForm.controls.height.value ? +this.clientForm.controls.height.value.trim() : 0;
          this.client.update(<UpdateClientCommand>clientObj).subscribe(response => {
            if (response.succeeded === true) {
              this.toastrService.success('', 'Client ' + Messages.EDITED);
            }
            else if (response.succeeded === false) {
              this.toastrService.info('', response.errors);
            }
          });
        } catch (error) {
          this.toastrService.danger('', Messages.WRONG);
        }
      }
    }
    else {
      this.toastrService.danger('', 'Please enter valid details');
    }
  }

  openDialog(id: string) {
    this.dialogService.open(ConfirmationComponent, {
      context: {
        title: 'send client an invitation',
        flag: 1
      },
      autoFocus: false
    })
      .onClose.subscribe(response => {
        if (response === 'yes') {
          this.sendInvite(id);
        }
      });
  }

  sendInvite(id: string) {
    if (id) {
      try {
        this.registrationClient.sendInvite(id).subscribe(response => {
          if (response.succeeded) {
            this.toastrService.success('', Messages.INVITATION);
          }
          else if (!response.succeeded) {
            this.toastrService.danger('', response.errors);
          }
        });
      } catch (error) {
        this.toastrService.danger('', Messages.WRONG);
      }
    }
  }

  async canAddClient(count) {
    const planId = this.businessInfo.plan;
    const res = await this.plan.getPlans().toPromise();
    const currentPlan = res.find(e => e.id === planId);
      if (count + 1 > currentPlan.maxCustomers) {
      return false;
    }
    else {
      return true;
    }
  }

  async getClientsList(id) {
    try {
      const resp = await this.client.getClientsForBusiness(id).toPromise();
      if (resp) {
        this.currentClientCount = resp.lists.length;
      }
    } catch (error) {
      this.toastrService.danger('', Messages.WRONG);
    }
  }

}
