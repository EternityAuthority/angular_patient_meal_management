import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FoodgroupsComponent } from './foodgroups/list/foodgroups.component';
import { AddfoodgroupComponent } from './foodgroups/add/addfoodgroup/addfoodgroup.component';
import { NutrientsComponent } from './nutrients/list/nutrients.component';
import { NutrientAddComponent } from './nutrients/add/nutrient-add/nutrient-add.component';
import { FoodComponent } from './food/list/food.component';
import { AddfoodComponent } from './food/add/addfood.component';
import { ListComponent } from './clients/list/list.component';
import { AddComponent } from './clients/add/add.component';

const routes: Routes = [
  {
    path: '',
    // component: AdminHomeComponent,
    children: [
      {
        path: 'foodgroups-list',
        component: FoodgroupsComponent
      },
      {
        path: 'foodgroup-add',
        component: AddfoodgroupComponent
      },
      {
        path: 'foodgroup-edit/:Id',
        component: AddfoodgroupComponent
      },
      {
        path: 'nutrients-list',
        component: NutrientsComponent
      },
      {
        path: 'nutrient-add',
        component: NutrientAddComponent
      },
      {
        path: 'nutrient-edit/:Id',
        component: NutrientAddComponent
      },
      {
        path: 'foods-list',
        component: FoodComponent
      },
      {
        path: 'food-add',
        component: AddfoodComponent
      },
      {
        path: 'food-edit/:Id',
        component: AddfoodComponent
      },
      {
        path: 'clients-list',
        component: ListComponent
      },
      // {
      //   path: 'client-add',
      //   component: AddComponent
      // },
      {
        path: 'client-edit/:Id',
        component: AddComponent
      },
      {
        path: '',
        redirectTo: 'foodgroups-list',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminHomeRoutingModule { }
