import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { FoodGroupClient, RegistrationClient } from '../../../../Nutricalc-api';
import { ConfirmationComponent } from '../../../dialogs/confirmation/confirmation.component';
import { Messages } from '../../../Services/constants';
import { LoadingService } from '../../../Services/loading.service';
import { UserService } from '../../../Services/user.service';


@Component({
  selector: 'ngx-foodgroups',
  templateUrl: './foodgroups.component.html',
  styleUrls: ['./foodgroups.component.scss']
})
export class FoodgroupsComponent implements OnInit {

  settings = {
    mode: 'external',
    columns: {
      name: {
        title: 'Name',
        type: 'string',
      },
      description: {
        title: 'Description',
        type: 'string',
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
    },
  };

  source: LocalDataSource;

  constructor(private router: Router, private foodGroup: FoodGroupClient,
    private toastrService: NbToastrService, public load: LoadingService,
    private user: UserService, private userInfo: RegistrationClient,
    private dialogService: NbDialogService) {
  }

  ngOnInit(): void {
    if (!this.user.getAdmin()) {
      this.getUserInfo();
    }
    this.getFoodGroupsList();
  }

  getUserInfo() {
    const user = JSON.parse(atob(localStorage.getItem('myAuthDetail')));
    if (user) {
      this.userInfo.get2('userId', undefined, user.userId).subscribe(response => {
        if (response) {
          this.user.setAdmin({
            companyName: response.data.companyName,
            contactEmail: response.data.contactEmail,
            contactFirstName: response.data.contactFirstName,
            contactLastName: response.data.contactLastName,
            contactPhone: response.data.contactPhone,
            id: response.data.id,
            plan: response.data.plan.id,
            planExpiryDate: response.data.planExpiryDate
          });
        }
      });
    }
  }

  getFoodGroupsList() {
    try {
      this.foodGroup.get().subscribe(resp => {
        if (resp) {
          this.source = new LocalDataSource(resp['lists']);
        }
      });
    } catch (error) {
      this.toastrService.danger('', Messages.WRONG);
    }
  }

  addFoodGroup() {
    this.router.navigate(['/pages/admin/foodgroup-add']);
  }

  onEdit($event) {
    this.router.navigate([`/pages/admin/foodgroup-edit/${$event.data.id}`]);
  }

  onDelete($event) {
    this.dialogService.open(ConfirmationComponent, {
      context: {
        title: 'delete this food group',
        flag: 1
      },
      autoFocus: false
    })
      .onClose.subscribe(sts => {
        if (sts === 'yes') {
          this.deleteFoodGroup($event.data.id);
        }
      });
  }

  deleteFoodGroup(id: number) {
    try {
      this.foodGroup
        .delete(id)
        .subscribe((res) => {
          if (res) {
            this.toastrService.success('', Messages.DELETED);
            this.getFoodGroupsList();
          } else {
            this.toastrService.danger('', Messages.WRONG);
          }
        });
    } catch (error) {
      this.toastrService.danger('', Messages.WRONG);
    }
  }

}
