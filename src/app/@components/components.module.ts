/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxValidationMessageComponent } from './validation-message/validation-message.component';
import {
  NgxFilterByNumberComponent,
} from './custom-smart-table-components/filter-by-number/filter-by-number.component';
// import { ShowcaseDialogComponent } from '../pages/modal-overlays/dialog/showcase-dialog/showcase-dialog.component';
import { DialogNamePromptComponent } from '../pages/modal-overlays/dialog/dialog-name-prompt/dialog-name-prompt.component';

import { NbCardModule } from '@nebular/theme';

const COMPONENTS = [
  NgxValidationMessageComponent,
  NgxFilterByNumberComponent,
  // ShowcaseDialogComponent,
  DialogNamePromptComponent,
];

@NgModule({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    NbCardModule,
  ],
  exports: [...COMPONENTS],
  declarations: [...COMPONENTS],
  entryComponents: [
    NgxFilterByNumberComponent,
    // ShowcaseDialogComponent,
  ],
})
export class ComponentsModule {
}
