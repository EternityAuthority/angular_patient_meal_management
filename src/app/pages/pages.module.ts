/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { PagesMenu } from './pages-menu';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { NbButtonModule, NbCardModule, NbMenuModule } from '@nebular/theme';
import { AuthModule } from '../@auth/auth.module';
import { ConfirmationComponent } from './dialogs/confirmation/confirmation.component';
// import { PreviewreportComponent } from './dialogs/previewreport/previewreport.component';
import { NgxEchartsModule } from 'ngx-echarts';


const PAGES_COMPONENTS = [
  PagesComponent,
];

@NgModule({
  imports: [
   
    PagesRoutingModule,
    ThemeModule,
    ECommerceModule,
    NbMenuModule,
    NbCardModule,
    NbButtonModule,
    MiscellaneousModule,
    AuthModule.forRoot(),
    NgxEchartsModule
  ],
  declarations: [
    ...PAGES_COMPONENTS,
    ConfirmationComponent,
    // PreviewreportComponent
  ],
  providers: [
    PagesMenu,
  ],
})
export class PagesModule {
}
