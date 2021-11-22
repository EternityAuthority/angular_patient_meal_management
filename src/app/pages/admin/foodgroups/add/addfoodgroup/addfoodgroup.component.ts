import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { CreateFoodGroupCommand, FoodGroupClient, UpdateFoodGroupCommand } from '../../../../../Nutricalc-api';
import { Messages } from '../../../../Services/constants';
import { LoadingService } from '../../../../Services/loading.service';

enum Mode {
  EDIT = 'Edit',
  ADD = 'Add',
}

@Component({
  selector: 'ngx-addfoodgroup',
  templateUrl: './addfoodgroup.component.html',
  styleUrls: ['./addfoodgroup.component.scss']
})
export class AddfoodgroupComponent implements OnInit {

  foodgroupForm: FormGroup;
  mode: Mode;
  foodGroupId: number;

  get name() {
    return this.foodgroupForm.get('name');
  }

  get description() {
    return this.foodgroupForm.get('description');
  }

  constructor(private fb: FormBuilder, private route: ActivatedRoute,
    private router: Router, private foodGroup: FoodGroupClient,
    private toastrService: NbToastrService, public load: LoadingService) {
    this.initForm();
    this.foodGroupId = +this.route.snapshot.paramMap.get('Id');
    if (this.foodGroupId) {
      this.mode = Mode.EDIT;
    } else {
      this.mode = Mode.ADD;
    }
  }

  initForm() {
    this.foodgroupForm = this.fb.group({
      name: this.fb.control('', [Validators.required, Validators.minLength(1), Validators.maxLength(250)]),
      description: this.fb.control('', [Validators.minLength(1), Validators.maxLength(100)])
    });
  }

  ngOnInit(): void {
    if (this.foodGroupId) {
      this.getData(this.foodGroupId);
    }
  }

  getData(id: number) {
    try {
      this.foodGroup.get2(id).subscribe(response => {
        if (response.data != null) {
          this.foodgroupForm.patchValue(response.data);
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
    this.foodGroupId ? this.editFoodGroup() : this.createFoodGroup();
  }

  createFoodGroup() {
    if (this.foodgroupForm.valid) {
      if (this.foodgroupForm.controls.name.value.trim() === '') {
        this.toastrService.danger('', Messages.EMPTY_NAME);
      }
      else {
        try {
          this.foodGroup.create(<CreateFoodGroupCommand>{
            name: this.foodgroupForm.controls.name.value.trim(),
            description: this.foodgroupForm.controls.description.value.trim()
          }).subscribe(response => {
            if (response.succeeded === true) {
              this.toastrService.success('', 'FoodGroup ' + Messages.CREATED);
              this.initForm();
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
  }

  editFoodGroup() {
    if (this.foodgroupForm.valid) {
      if (this.foodgroupForm.controls.name.value.trim() === '') {
        this.toastrService.danger('', Messages.EMPTY_NAME);
      }
      else {
        try {
          this.foodGroup.update(this.foodGroupId, <UpdateFoodGroupCommand>{
            id: this.foodGroupId,
            name: this.foodgroupForm.controls.name.value.trim(),
            description: this.foodgroupForm.controls.description.value.trim()
          }).subscribe(response => {
            if (response.succeeded === true) {
              this.toastrService.success('', 'FoodGroup ' + Messages.EDITED);
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
  }

  back() {
    this.router.navigate(['/pages/admin/foodgroups-list']);
  }

}
