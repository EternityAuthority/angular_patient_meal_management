import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessRoutingModule } from './business-routing.module';
import { BusinessComponent } from './business.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { MyClientsComponent } from './my-clients/my-clients.component';
import { NbActionsModule, NbButtonModule, NbCardModule, NbInputModule, NbTabsetModule, NbUserModule, NbRadioModule, NbSelectModule, NbListModule, NbIconModule, NbSpinnerModule, NbDatepickerModule, NbAccordionModule, NbRouteTabsetModule, NbStepperModule, NbTooltipModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ComponentsModule } from '../../@components/components.module';
import { ThemeModule } from '../../@theme/theme.module';
import { AddclientComponent } from './addclient/addclient.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { PaymentComponent } from './payment/payment.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { ViewinvoiceComponent } from './viewinvoice/viewinvoice.component';
import { ClientFoodReviewComponent } from './client-food-review/client-food-review.component';

import { TooltipModule } from 'ng2-tooltip-directive';
import { BusinessdashboardComponent } from './businessdashboard/businessdashboard.component';
import { NgxEchartsModule } from 'ngx-echarts';

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
  NbDatepickerModule,
  NbTooltipModule,
  NgxEchartsModule
];

@NgModule({
  declarations: [BusinessComponent, MyAccountComponent, MyClientsComponent,
    AddclientComponent, UpdatePasswordComponent, PaymentComponent,
    InvoicesComponent, ViewinvoiceComponent,
    ClientFoodReviewComponent, BusinessdashboardComponent],
  imports: [
    CommonModule,
    BusinessRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    NbRouteTabsetModule,
    NbStepperModule,
    NbAccordionModule,
    Ng2SmartTableModule,
    ComponentsModule,
    ...NB_MODULES,
    TooltipModule
  ]
})
export class BusinessModule { }
