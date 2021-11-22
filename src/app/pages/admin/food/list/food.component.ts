import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { FoodClient, FoodGroupClient } from '../../../../Nutricalc-api';
import { ConfirmationComponent } from '../../../dialogs/confirmation/confirmation.component';
import { Messages } from '../../../Services/constants';
import { LoadingService } from '../../../Services/loading.service';

@Component({
  selector: 'ngx-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.scss']
})
export class FoodComponent implements OnInit {

  settings = {
    mode: 'external',
    columns: {
      name: {
        title: 'Name',
        type: 'string',
      },
      foodGroupName: {
        title: 'Food Group',
        type: 'string',
        valuePrepareFunction: (cell, element) =>
          this.customDisplay(element.foodGroup, element.foodGroup.name)
      },
        servingSuggestion: {
        title: 'Serving suggestion',
        type: 'string',
      },
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

  foodGroupId: number;

  foodGroups: Array<object>;

  source: LocalDataSource;

  constructor(private food: FoodClient, private router: Router,
    private toastrService: NbToastrService, private fg: FoodGroupClient,
    public load: LoadingService, private dialogService: NbDialogService) {
  }

  ngOnInit(): void {
    this.getFoodsList(null, 0);
    this.getFoodGroupsList();
  }

  getFoodsList(foodName: string, foodGroupId?) {
    try {
      this.food.get(foodName && foodName.trim() !== '' ? foodName.trim() : '', foodGroupId).subscribe(resp => {
        if (resp && resp['lists'].length > 0) {
          this.source = new LocalDataSource(resp['lists']);
        }
      });
    } catch (error) {
      // console.log(error);
      this.toastrService.danger('', Messages.WRONG);
    }
  }

  private customDisplay(conditionValue: any, displayValue: string) {
    return conditionValue ? displayValue : '';
  }

  addFood() {
    this.router.navigate(['/pages/admin/food-add']);
  }

  onEdit($event) {
    this.router.navigate([`/pages/admin/food-edit/${$event.data.id}`]);
  }

  onDelete($event) {
    this.dialogService.open(ConfirmationComponent, {
      context: {
        title: 'delete this food',
        flag: 1
      },
      autoFocus: false
    })
      .onClose.subscribe(sts => {
        if (sts === 'yes') {
          this.deleteFood($event.data.id);
        }
      });
  }

  deleteFood(id: number) {
    try {
      this.food
        .delete(id)
        .subscribe((res) => {
          if (res) {
            this.toastrService.success('', Messages.DELETED);
            this.getFoodsList(null, 0);
          } else {
            this.toastrService.danger('', Messages.WRONG);
          }
        });
    } catch (error) {
      this.toastrService.danger('', Messages.WRONG);
    }
  }


  getFoodGroupsList() {
    try {
      this.fg.get().subscribe(resp => {
        if (resp) {
          this.load.setLoadingStatus(false);
          this.foodGroups = resp['lists'];
        }
      });
    } catch (error) {
      this.toastrService.danger('', Messages.WRONG);
    }
  }

  refreshSearch(fName) {
    fName.value = '';
    this.foodGroupId = null;
    this.getFoodsList(null, 0);
  }

}
