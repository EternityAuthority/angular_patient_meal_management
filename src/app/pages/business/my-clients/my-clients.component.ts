import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { ClientClient, RegistrationClient, ReportClient } from '../../../Nutricalc-api';
import { ConfirmationComponent } from '../../dialogs/confirmation/confirmation.component';
import { Messages } from '../../Services/constants';
import { LoadingService } from '../../Services/loading.service';
import { PlansService } from '../../Services/plans/plans.service';
import { IBusiness, UserService } from '../../Services/user.service';

@Component({
  selector: 'ngx-my-clients',
  templateUrl: './my-clients.component.html',
  styleUrls: ['./my-clients.component.scss']
})
export class MyClientsComponent implements OnInit {

  settings = {
    mode: 'external',
    columns: {
      status: {
        title: 'Status',
        type: 'html',
        filter: true,
        valuePrepareFunction: (cell, element) => {
          if (element.status === 'In progress') {
            return this.dom.bypassSecurityTrustHtml(`<div class="stsProgress">${element.status}</div>`);
          }
          else if (element.status === 'Done') {
            return this.dom.bypassSecurityTrustHtml(`<div class="stsDone">${element.status}</div>`);
          }
          // else {
          //   return this.dom.bypassSecurityTrustHtml(`<div style="text-align: center"><span>${element.status}</span></div>`);
          // }
        }
      },
      created: {
        title: 'Date',
        type: 'date',
        filter: false,
        valuePrepareFunction: (date) => {
          if (date) {
            return new DatePipe('en-US').transform(date, 'dd.MM.yyyy');
          }
        }
      },
      firstName: {
        filter: true,
        title: 'First Name',
        type: 'string',
        sort: true
      },
      lastName: {
        filter: true,
        title: 'Last Name',
        type: 'string',
        sort: true
      },
      emailAddress: {
        title: 'E-mail',
        type: 'html',
        sort: false,
        filter: false,
        valuePrepareFunction: (cell, element) => {
          return this.dom.bypassSecurityTrustHtml(`<span class="testClass">${element.emailAddress}</span>`);
        }
      },
      invite: {
        title: 'Invite',
        type: 'html',
        sort: false,
        filter: false,
        valuePrepareFunction: (cell, element) => {
          if (element.isSendInvite) {
            return this.dom.bypassSecurityTrustHtml(
              `<div style="text-align: center"><button type="button" class="dis" disabled><b>Sent</b> <i style="margin-left: 5px" class="fa fa-envelope"></i></button></div>`);
          }
          else if (!element.isSendInvite) {
            return this.dom.bypassSecurityTrustHtml(
              `<div style="text-align: center"><button class="enb" type="button" id="${element.id}"><b>Send</b> <i style="margin-left: 5px" class="fa fa-envelope"></i></button></div>`);
          }
        }
      },
      Results: {
        title: 'Result',
        type: 'html',
        sort: false,
        filter: false,
        valuePrepareFunction: (cell, element) => {
          return this.dom.bypassSecurityTrustHtml(
            `<div style="text-align: center">
            <button type="button" id="${element.clientGUID}" ${element.status === 'In progress' ? 'disabled class="dis"' : 'class="rev"'}><b>Review</b> <i style="margin-left: 5px"></i></button>
            <button type="button" id="${element.clientGUID}" ${element.status === 'In progress' ? 'disabled class="dis"' : 'class="pdf"'}><b>Pdf</b> <i style="margin-left: 5px" class="fa fa-file-download" aria-hidden="true"></i></button>
            <button type="button" id="${element.id}" ${element.status === 'In progress' ? 'disabled class="dis"' : 'class="report"'}><b>Send</b> <i style="margin-left: 5px" class="fa fa-envelope"></i></button>
            </div>`);
        }
      }
    },
    actions: {
      add: false,
      position: 'right'
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
    }
  };


  source: LocalDataSource;
  businessId: string;
  businessInfo: IBusiness;
  currentClientCount: Array<object>;

  constructor(public load: LoadingService, private client: ClientClient,
    private toastrService: NbToastrService, private user: UserService,
    private router: Router, private dom: DomSanitizer,
    private registrationClient: RegistrationClient,
    private reportClient: ReportClient,
    private dialogService: NbDialogService,
    private plan: PlansService, private http: HttpClient) { }

  ngOnInit(): void {
    this.businessInfo = this.user.currentUser$.value;
    this.businessId = this.businessInfo.id;
    if (this.businessInfo && this.businessId) {
      this.getClientsList(this.businessId);
    }
  }

  doFilter(search?: string): boolean {
    const match = this.currentClientCount.map(s => s['firstName'] + s['lastName']).indexOf(search) > -1;
    if (match || search === '') {
      return true;
    } else {
      return false;
    }
  }

  async getClientsList(id) {
    try {
      this.client.getClientsForBusiness(id).subscribe(resp => {
        if (resp) {
          this.source = new LocalDataSource(resp['lists']);
          this.currentClientCount = resp.lists;
          this.myFunction();
        }
      });
    } catch (error) {
      this.toastrService.danger('', Messages.WRONG);
    }
  }

  onEdit($event) {
    this.router.navigate([`/pages/business/edit-client/${$event.data.id}`]);
  }

  onDelete($event) {
    this.dialogService.open(ConfirmationComponent, {
      context: {
        title: 'delete this client',
        flag: 1
      },
      autoFocus: false
    })
      .onClose.subscribe(sts => {
        if (sts === 'yes') {
          this.deleteClient($event.data.id);
        }
      });
  }

  myFunction() {
    setTimeout(() => {
      const buttons = document.getElementsByClassName('enb');
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', (e) => {
          e.preventDefault();
          this.sendInvite(e.currentTarget['attributes'].id.value);
        });
      }

      const reviewButtons = document.getElementsByClassName('rev');
      for (let i = 0; i < reviewButtons.length; i++) {
        reviewButtons[i].addEventListener('click', (e) => {
          e.preventDefault();
          this.router.navigateByUrl(`/pages/business/client-food-review?userId=${e.currentTarget['attributes'].id.value}`);
        });
      }

      const pdfButtons = document.getElementsByClassName('pdf');
      for (let i = 0; i < pdfButtons.length; i++) {
        pdfButtons[i].addEventListener('click', (e) => {
          e.preventDefault();
          this.openPreviewForReport(e.currentTarget['attributes'].id.value);
        });
      }

      const reportButtons = document.getElementsByClassName('report');
      for (let i = 0; i < reportButtons.length; i++) {
        reportButtons[i].addEventListener('click', (e) => {
          e.preventDefault();
          this.sendReportToEmail(e.currentTarget['attributes'].id.value);
        });
      }
    }, 1500);
  }

  sendReportToEmail(id) {
    try {
      this.registrationClient.sendReport(id).subscribe(response => {
        if (response.succeeded) {
          this.toastrService.success('', 'Report sent successfully');
        }
        else if (!response.succeeded) {
          this.toastrService.danger('', response.errors);
        }
      });
    } catch (error) {
      this.toastrService.danger('', Messages.WRONG);
    }
  }

  sendInvite(id: string) {
    if (id) {
      try {
        this.registrationClient.sendInvite(id).subscribe(response => {
          if (response.succeeded) {
            this.toastrService.success('', Messages.INVITATION);
            this.getClientsList(this.businessId);
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

  deleteClient(id: string) {
    try {
      this.client
        .delete(id)
        .subscribe((res) => {
          if (res) {
            this.toastrService.success('', Messages.DELETED);
            this.getClientsList(this.businessId);
          }
        });
    } catch (error) {
      this.toastrService.danger('', Messages.WRONG);
    }
  }

  async canAddClient() {
    const planId = this.businessInfo.plan;
    const res = await this.plan.getPlans().toPromise();
    const currentPlan = res.find(e => e.id === planId);
    if (currentPlan) {
      // console.log(currentPlan);
    }
    await this.getClientsList(this.businessId);
      if (this.currentClientCount.length + 1 > currentPlan.maxCustomers) {
      return false;
    }
    else {
      return true;
    }
  }

  async addClient() {
    this.router.navigate(['/pages/business/add-client']);
  }

  openPreviewForReport(id) {
    this.router.navigateByUrl(`/pages/business/ViewPdf?userId=${id}`);
  }

}
