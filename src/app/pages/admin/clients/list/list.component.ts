import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { RegistrationClient } from '../../../../Nutricalc-api';
import { ConfirmationComponent } from '../../../dialogs/confirmation/confirmation.component';
import { Messages } from '../../../Services/constants';
import { LoadingService } from '../../../Services/loading.service';

@Component({
  selector: 'ngx-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  settings = {
    mode: 'external',
    columns: {
      companyName: {
        title: 'Business Name',
        type: 'string',
      },
      contactPhone: {
        title: 'Contact',
        type: 'string',
        sort: false,
      },
      contactEmail: {
        title: 'Email',
        type: 'string',
        sort: false,
      },
      planName: {
        title: 'Plan Name',
        type: 'string',
        filter: false,
        valuePrepareFunction: (cell, element) =>
          this.customDisplay(element.plan, element.plan.description)
      },
      planCustomers: {
        title: 'Customers',
        type: 'string',
        filter: false,
        valuePrepareFunction: (cell, element) =>
            this.customDisplay(element.plan, element.plan.maxCustomers)
      }
    },
    actions: {
      add: false,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
    }
  };

  source: LocalDataSource;

  constructor(private client: RegistrationClient, private router: Router,
    private toastrService: NbToastrService, public load: LoadingService,
    private dialogService: NbDialogService) {
  }

  private customDisplay(conditionValue: any, displayValue: string) {
    return conditionValue ? displayValue : '';
  }

  ngOnInit(): void {
    this.getClientsList();
  }

  getClientsList() {
    try {
      this.client.get().subscribe(resp => {
        if (resp && resp.lists.length > 0) {
          this.source = new LocalDataSource(resp['lists']);
        }
      });
    } catch (error) {
      this.toastrService.danger('', Messages.WRONG);
    }
  }

  addClient() {
    this.router.navigate(['/pages/admin/client-add']);
  }

  onEdit($event) {
    this.router.navigate([`/pages/admin/client-edit/${$event.data.id}`]);
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

  deleteClient(id: string) {
    try {
      this.client
        .delete(id)
        .subscribe((res) => {
          if (res) {
            this.toastrService.success('', Messages.DELETED);
            this.getClientsList();
          }
        });
    } catch (error) {
      this.toastrService.danger('', Messages.WRONG);
    }
  }

}
