import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { CreateNutrientCommand, ICategory, NutrientClient, UpdateNutrientCommand } from '../../../../../Nutricalc-api';
import { Messages } from '../../../../Services/constants';
import { LoadingService } from '../../../../Services/loading.service';
import { PlansService } from '../../../../Services/plans/plans.service';

enum Mode {
  EDIT = 'Edit',
  ADD = 'Add',
}

@Component({
  selector: 'ngx-nutrient-add',
  templateUrl: './nutrient-add.component.html',
  styleUrls: ['./nutrient-add.component.scss']
})
export class NutrientAddComponent implements OnInit {

  nutrientForm: FormGroup;
  mode: Mode;
  nutrientId: number;
  unitsArray: string[] = ['g', 'mg', 'mcg', 'IU', 'Cal', 'Kj', 'percent'];

  categories: ICategory[];

  get name() {
    return this.nutrientForm.get('name');
  }

  get description() {
    return this.nutrientForm.get('description');
  }

  get unit() {
    return this.nutrientForm.get('unit');
  }

  get category() {
    return this.nutrientForm.get('categoryId');
  }

  get recommendedMin() {
    return this.nutrientForm.get('recommendedMin');
  }

  get recommendedMax() {
    return this.nutrientForm.get('recommendedMax');
  }

  get multiplier() {
    return this.nutrientForm.get('multiplier');
  }

  get divisor() {
    return this.nutrientForm.get('divisor');
  }

  constructor(private fb: FormBuilder, private route: ActivatedRoute,
    private router: Router, private nutrient: NutrientClient,
    private toastrService: NbToastrService, public load: LoadingService,
    private categoryService: PlansService) {
    this.initForm();
    this.nutrientId = +this.route.snapshot.paramMap.get('Id');
    if (this.nutrientId) {
      this.mode = Mode.EDIT;
    } else {
      this.mode = Mode.ADD;
    }
  }

  initForm() {
    this.nutrientForm = this.fb.group({
      name: this.fb.control('', [Validators.required]),
      description: this.fb.control(''),
      unit: this.fb.control('g'),
      categoryId: this.fb.control(null, Validators.required),
      recommendedMin: this.fb.control('0', [Validators.required, Validators.pattern('^[0-9.]*$')]),
      recommendedMax: this.fb.control('0', [Validators.required, Validators.pattern('^[0-9.]*$')]),
      multiplier: this.fb.control('0', [Validators.pattern('^[0-9.]*$')]),
      divisor: this.fb.control('0', [Validators.pattern('^[0-9.]*$')])
    });
  }

  async ngOnInit() {
    await this.getCategories();
    if (this.nutrientId) {
      this.getData(this.nutrientId);
    }
  }

  getData(id: number) {
    try {
      this.nutrient.get2(id).subscribe(response => {
        if (response.data != null) {
          this.nutrientForm.patchValue(response.data);
          this.nutrientForm.controls.categoryId.setValue(response.data.category.id);
          this.load.setLoadingStatus(false);
        }
        else {
          this.router.navigate(['/pages/admin/**']);
        }
      });
    } catch (error) {
      this.toastrService.danger('', Messages.WRONG);
    }
  }

  async getCategories() {
    this.categoryService.getNutrients().subscribe(response => {
      if (response) {
        this.categories = response;
        this.nutrientForm.controls.categoryId.setValue(this.categories[0].id);
      }
    });
  }

  save() {
    this.nutrientId ? this.editNutrient() : this.createNutrient();
  }

  createNutrient() {
    if (this.nutrientForm.valid) {
      if (this.nutrientForm.controls.name.value.trim() === '') {
        this.toastrService.danger('', Messages.EMPTY_NAME);
      }
      else {
        try {
          this.nutrient.create(<CreateNutrientCommand>{
            name: this.nutrientForm.controls.name.value.trim(),
            description: this.nutrientForm.controls.description.value.trim(),
            unit: this.nutrientForm.controls.unit.value,
            categoryId: this.nutrientForm.controls.categoryId.value,
            recommendedMin: +this.nutrientForm.controls.recommendedMin.value,
            recommendedMax: +this.nutrientForm.controls.recommendedMax.value,
            multiplier: +this.nutrientForm.controls.multiplier.value,
            divisor: +this.nutrientForm.controls.divisor.value
          }).subscribe(response => {
            if (response.succeeded === true) {
              this.toastrService.success('', 'Nutrient ' + Messages.CREATED);
              this.load.setLoadingStatus(false);
              this.initForm();
              this.nutrientForm.controls.categoryId.setValue(this.categories[0].id);
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

  editNutrient() {
    if (this.nutrientForm.valid) {
      if (this.nutrientForm.controls.name.value.trim() === '') {
        this.toastrService.danger('', Messages.EMPTY_NAME);
      } else {
        try {
          this.nutrient.update(this.nutrientId, <UpdateNutrientCommand>{
            id: this.nutrientId,
            name: this.nutrientForm.controls.name.value.trim(),
            description: this.nutrientForm.controls.description.value.trim(),
            unit: this.nutrientForm.controls.unit.value,
            categoryId: this.nutrientForm.controls.categoryId.value,
            recommendedMin: +this.nutrientForm.controls.recommendedMin.value,
            recommendedMax: +this.nutrientForm.controls.recommendedMax.value,
            multiplier: +this.nutrientForm.controls.multiplier.value,
            divisor: +this.nutrientForm.controls.divisor.value
          }).subscribe(response => {
            if (response.succeeded === true) {
              this.toastrService.success('', 'Nutrient ' + Messages.EDITED);
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
    this.router.navigate(['/pages/admin/nutrients-list']);
  }

}
