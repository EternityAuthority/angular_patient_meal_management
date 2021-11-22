import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  title: string;
  flag: number;

  constructor(protected dialogRef: NbDialogRef<ConfirmationComponent>) {
  }

  cancel() {
    this.dialogRef.close('no');
  }

  submit() {
    this.dialogRef.close('yes');
  }

  ngOnInit(): void {
  }

}
