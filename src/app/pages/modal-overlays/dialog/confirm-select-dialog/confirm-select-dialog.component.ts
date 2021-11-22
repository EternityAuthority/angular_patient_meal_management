/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-confirm-select-dialog',
  templateUrl: 'confirm-select-dialog.component.html',
  styleUrls: ['confirm-select-dialog.component.scss'],
})
export class ConfirmSelectDialogComponent {

  constructor(protected ref: NbDialogRef<ConfirmSelectDialogComponent>) {}

  cancel() {
    this.ref.close(false);
  }

  submit() {
    this.ref.close(true);
  }
}
