import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChartjsComponent } from '../charts/chartjs/chartjs.component';
// import { PreviewreportComponent } from '../dialogs/previewreport/previewreport.component';
import { AddclientComponent } from './addclient/addclient.component';
import { BusinessdashboardComponent } from './businessdashboard/businessdashboard.component';
import { ClientFoodReviewComponent } from './client-food-review/client-food-review.component';
import { InvoicesComponent } from './invoices/invoices.component';

import { MyAccountComponent } from './my-account/my-account.component';
import { MyClientsComponent } from './my-clients/my-clients.component';
import { PaymentComponent } from './payment/payment.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';

const routes: Routes = [
  {
    path: '',
    children: [
      // {
      //   path: 'Dashboard',
      //   component: BusinessdashboardComponent
      // },
      {
        path: 'my-account',
        component: MyAccountComponent
      },
      {
        path: 'my-clients',
        component: MyClientsComponent
      },
      {
        path: 'add-client',
        component: AddclientComponent
      },
      {
        path: 'edit-client/:Id',
        component: AddclientComponent
      },
      {
        path: 'update-password',
        component: UpdatePasswordComponent
      },
      {
        path: 'payment',
        component: PaymentComponent
      },
      {
        path: 'View-Invoices/:id',
        component: InvoicesComponent
      },
      {
        path: 'client-food-review',
        component: ClientFoodReviewComponent
      },
      // {
      //   path: 'ViewPdf',
      //   component: PreviewreportComponent
      // },
      {
        path: '',
        redirectTo: 'my-account',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessRoutingModule { }
