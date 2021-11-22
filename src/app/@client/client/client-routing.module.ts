import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from '../../pages/miscellaneous/not-found/not-found.component';
import { ClientComponent } from './client.component';
import { ClientinfoComponent } from './clientinfo/clientinfo.component';


const routes: Routes = [
  {
    path: '',
    component: ClientComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'client-info'
      },
      {
        path: 'client-info',
        component: ClientinfoComponent
      },
      {
        path: '**',
        component: NotFoundComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
