import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { InvoiceClient } from '../../../Nutricalc-api';
import { LoadingService } from '../../Services/loading.service';
import { ViewinvoiceComponent } from '../viewinvoice/viewinvoice.component';

@Component({
  selector: 'ngx-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {

  settings = {
    mode: 'external',
    columns: {
      planName: {
        title: 'Plan Name',
        type: 'html',
        filter: false,
        sort: false,
        valuePrepareFunction: (cell, element) => {
          return this.dom.bypassSecurityTrustHtml(`<span class="plan">${element.planName}</span>`);
        }
      },
      startDate: {
        title: 'Start Date',
        type: 'string',
        filter: false,
        sort: false,
        valuePrepareFunction: (cell, element) => {
          return new DatePipe('en-US').transform(new Date(element.startDate), 'dd.MM.yyyy');
        }
      },
      endDate: {
        title: 'End Date',
        type: 'string',
        filter: false,
        sort: false,
        valuePrepareFunction: (cell, element) => {
          return new DatePipe('en-US').transform(new Date(element.endDate), 'dd.MM.yyyy');
        }
      },
      Amount: {
        title: 'Amount',
        sort: false,
        filter: false,
        type: 'string',
        valuePrepareFunction: (cell, element) => {
          return `$${element.amount}`;
        }
      },
      billedTo: {
        title: 'Billed To',
        type: 'string',
        sort: false,
        filter: false
      },
      download: {
        title: 'Download invoice PDF',
        type: 'html',
        sort: false,
        filter: false,
        valuePrepareFunction: (cell, element) => {
          return this.dom.bypassSecurityTrustHtml(`<a class="dwld" id="${element.id}" href="${window.location.origin}/invoice/${element.id}/pdf" target="_blank"> <i style="margin-left: 5px;color: #42B1F4;" class="fa fa-download"></i> View</a>`);
        }
      }
    },
    actions: false
  };

  source: LocalDataSource;
  constructor(private invoice: InvoiceClient, private route: ActivatedRoute,
    public load: LoadingService, private dom: DomSanitizer, private dialogService: NbDialogService) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getInvoicesList(id);
    }
  }

  getInvoicesList(id) {
    this.invoice.getInvoices(id).subscribe(response => {
      if (response.lists.length > 0) {
        this.source = new LocalDataSource(response.lists);
      }
    });
  }

  // viewInvoice(data) {
  //   this.dialogService.open(ViewinvoiceComponent, {
  //     context: {
  //       data: data
  //     },
  //     autoFocus: false
  //   })
  //     .onClose.subscribe(sts => {

  //     });
  // }
}
