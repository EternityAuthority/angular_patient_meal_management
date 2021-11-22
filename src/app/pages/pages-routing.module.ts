/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { ECommerceComponent } from './e-commerce/e-commerce.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { AdminauthGuard } from './Guards/adminauth.guard';
import { BusinessauthGuard } from './Guards/businessauth.guard';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    // {
    //   path: 'dashboard',
    //   component: ECommerceComponent,
    // },
    {
      path: 'admin',
      canActivate: [AdminauthGuard],
      loadChildren: () => import('./admin/admin-home.module')
        .then(m => m.AdminHomeModule)
    },
    {
      path: 'business',
      canActivate: [BusinessauthGuard],
      loadChildren: () => import('./business/business.module')
        .then(m => m.BusinessModule)
    },
    {
      path: '**',
      component: NotFoundComponent,
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
