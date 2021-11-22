import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { IBusiness, UserService } from '../../Services/user.service';

import jspdf from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'ngx-viewinvoice',
  templateUrl: './viewinvoice.component.html',
  styleUrls: ['./viewinvoice.component.scss']
})
export class ViewinvoiceComponent implements OnInit {

  data: any;
  currentUser: IBusiness;

  constructor(protected dialogRef: NbDialogRef<ViewinvoiceComponent>,
    private user: UserService) { }

  ngOnInit(): void {
    if (this.user.currentUser$.value) {
      this.currentUser = this.user.currentUser$.value;
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  download() {
    // console.log(document.getElementById('invoiceDet'));
    const data = document.getElementById('invoiceDet');
    if (data) {
      html2canvas(data).then(canvas => {
        const pdf = new jspdf('p', 'pt', [canvas.width, canvas.height]);
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        pdf.addImage(imgData, 0, 0, canvas.width, canvas.height);
        pdf.save('converteddoc.pdf');
      });
    }
  }

}
