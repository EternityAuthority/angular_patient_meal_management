import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminHomeRoutingModule } from './admin-home-routing.module';
import { AdminHomeComponent } from './admin-home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../../@theme/theme.module';
import {
  NbTabsetModule, NbRouteTabsetModule, NbStepperModule, NbCardModule,
  NbButtonModule, NbListModule, NbAccordionModule, NbUserModule, NbActionsModule,
  NbInputModule, NbRadioModule, NbSelectModule, NbIconModule, NbSpinnerModule,
  NbDatepickerModule} from '@nebular/theme';
import { FoodgroupsComponent } from './foodgroups/list/foodgroups.component';
import { AddfoodgroupComponent } from './foodgroups/add/addfoodgroup/addfoodgroup.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NutrientsComponent } from './nutrients/list/nutrients.component';
import { NutrientAddComponent } from './nutrients/add/nutrient-add/nutrient-add.component';
import { FoodComponent } from './food/list/food.component';
import { AddfoodComponent } from './food/add/addfood.component';
import { ListComponent } from './clients/list/list.component';
import { AddComponent } from './clients/add/add.component';
import { ComponentsModule } from '../../@components/components.module';

const NB_MODULES = [
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbInputModule,
  NbTabsetModule,
  NbUserModule,
  NbRadioModule,
  NbSelectModule,
  NbListModule,
  NbIconModule,
  NbSpinnerModule,
  NbDatepickerModule,
  NbInputModule,
  NbDatepickerModule
];

@NgModule({
  declarations: [
    AdminHomeComponent,
    FoodgroupsComponent,
    AddfoodgroupComponent,
    NutrientsComponent,
    NutrientAddComponent,
    FoodComponent,
    AddfoodComponent,
    ListComponent,
    AddComponent
  ],
  imports: [
    CommonModule,
    AdminHomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    NbTabsetModule,
    NbRouteTabsetModule,
    NbStepperModule,
    NbCardModule,
    NbButtonModule,
    NbListModule,
    NbAccordionModule,
    NbUserModule,
    Ng2SmartTableModule,
    ComponentsModule,
    ...NB_MODULES
  ]
})
export class AdminHomeModule { }
