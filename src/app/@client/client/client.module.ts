import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { ClientComponent } from './client.component';
import { ClientinfoComponent } from './clientinfo/clientinfo.component';
import {
  NbAlertModule, NbButtonModule, NbCardModule, NbCheckboxModule,
  NbIconModule, NbInputModule, NbLayoutModule, NbSelectModule, NbSpinnerModule,
  NbStepperModule, NbTooltipModule
} from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../../@components/components.module';
import { ShowcaseDialogComponent } from '../../pages/modal-overlays/dialog/showcase-dialog/showcase-dialog.component';
import { ConfirmSelectDialogComponent } from '../../pages/modal-overlays/dialog/confirm-select-dialog/confirm-select-dialog.component';

import { TooltipModule } from 'ng2-tooltip-directive';

const NB_MODULES = [
  NbIconModule,
  NbLayoutModule,
  NbCardModule,
  NbAlertModule,
  NbCheckboxModule,
  NbInputModule,
  NbButtonModule,
  NbSelectModule,
  NbTooltipModule,
  NbSpinnerModule,
  NbStepperModule
];

@NgModule({
  declarations: [ClientComponent, ClientinfoComponent, ShowcaseDialogComponent, ConfirmSelectDialogComponent],
  imports: [
    NB_MODULES,
    TooltipModule,
    CommonModule,
    FormsModule,
    ClientRoutingModule,
    ReactiveFormsModule,
    ComponentsModule,
  ]
})
export class ClientModule { }
