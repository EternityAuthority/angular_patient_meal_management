import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {

  constructor(protected location: Location) { }

  ngOnInit(): void {
  }

  back() {
    this.location.back();
    return false;
  }

}
