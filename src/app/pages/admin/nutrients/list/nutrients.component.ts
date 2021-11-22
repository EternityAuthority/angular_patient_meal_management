import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { NutrientClient } from '../../../../Nutricalc-api';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { LoadingService } from '../../../Services/loading.service';
import { Messages } from '../../../Services/constants';
import { ConfirmationComponent } from '../../../dialogs/confirmation/confirmation.component';

@Component({
  selector: 'ngx-nutrients',
  templateUrl: './nutrients.component.html',
  styleUrls: ['./nutrients.component.scss']
})
export class NutrientsComponent implements OnInit {

  settings = {
    mode: 'external',
    columns: {
      name: {
        title: 'Name',
        type: 'string',
      },
      category:
      {
        title: 'Category',
        type: 'string',
        valuePrepareFunction: (cell, element) => {
          return element.category ? element.category.name : '';
        }
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

  constructor(private router: Router, private nutrient: NutrientClient,
    private toastrService: NbToastrService, public load: LoadingService,
    private dialogService: NbDialogService) {
  }

  ngOnInit(): void {
    this.getNutrientsList();
  }

  addNutrient() {
    this.router.navigate(['/pages/admin/nutrient-add']);
  }

  getNutrientsList() {
    try {
      this.nutrient.get().subscribe(resp => {
        if (resp) {
          this.source = new LocalDataSource(resp['lists']);
        }
      });
    } catch (error) {
      this.toastrService.danger('', Messages.WRONG);
    }
  }

  onEdit($event) {
    this.router.navigate([`/pages/admin/nutrient-edit/${$event.data.id}`]);
  }

  onDelete($event) {
    this.dialogService.open(ConfirmationComponent, {
      context: {
        title: 'delete this nutrient',
        flag: 1
      },
      autoFocus: false
    })
      .onClose.subscribe(sts => {
        if (sts === 'yes') {
          this.deleteNutrient($event.data.id);
        }
      });
  }

  deleteNutrient(id: number) {
    try {
      this.nutrient
        .delete(id)
        .subscribe((res) => {
          if (res) {
            this.toastrService.success('', Messages.DELETED);
            this.getNutrientsList();
          }
        });
    } catch (error) {
      this.toastrService.danger('', Messages.WRONG);
    }
  }

}
