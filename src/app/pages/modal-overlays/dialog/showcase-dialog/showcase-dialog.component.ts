/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */
import { Component, ElementRef, Input, ViewChild, AfterViewInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { fromEvent } from 'rxjs';
import { NbToastrService } from '@nebular/theme';
import { Messages } from '../../../../pages/Services/constants';
import { LoadingService } from '../../../../pages/Services/loading.service';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import {
  ClientClient, ClientFoodClient, CreateClientFoodCommand, Gender, UnitOfMeasurement, UpdateClientByUserId,
  UpdateClientStatus
} from '../../../../Nutricalc-api';
import { Subject } from 'rxjs';

@Component({
  selector: 'ngx-showcase-dialog',
  templateUrl: 'showcase-dialog.component.html',
  styleUrls: ['showcase-dialog.component.scss'],
})
export class ShowcaseDialogComponent implements AfterViewInit {

  clientInfo: ClientClient;

  foods: any[] = [];
  selectedFoods: any[] = [];
  currentCategory: string;
  tempFood: any[] = [];
  public close$ = new Subject();

  @Input() title: number;
  @ViewChild('srchkey', { static: false }) foodSearchInput: ElementRef;

  constructor(protected ref: NbDialogRef<ShowcaseDialogComponent>, private client: ClientClient,
    private food: ClientFoodClient, 
    private toast: NbToastrService,
    public load: LoadingService) {
    this.currentCategory = 'All';
  }

  dismiss() {
    this.ref.close();
  }

  submit() {
    this.ref.close(this.selectedFoods);
  }



  ngAfterViewInit() {
    this.setInput();
  }

  setInput() {
    fromEvent(this.foodSearchInput.nativeElement, 'keyup').pipe(
      map((event: any) => {
        return event.target.value;
      })
      , filter(res => res.length > 0)
      , debounceTime(1000)
      , distinctUntilChanged()
    ).subscribe((text: string) => {
      this.searchFoods(text);
    });
  }

  searchFoods(text: string) {
    try {
      this.food.get2(this.currentCategory, text.trim())
        .subscribe(response => {
          response.lists.forEach(e => {
            e['actualIntake'] = 0;
            e['selected'] = false;
            e['canEdit'] = false;
            e['meal'] = this.title;
          });
          for(let i=0; i<response.lists.length; i++){
             this.tempFood = [];
             this.tempFood['actualIntake'] = response.lists[i]['actualIntake'];
             this.tempFood['clientId'] = '';
             this.tempFood['day'] = 0;
             this.tempFood['foodGroupName'] = response.lists[i]['foodGroupName'];
             this.tempFood['foodId'] = response.lists[i]['foodId'];
             this.tempFood['foodName'] = response.lists[i]['foodName'];
             this.tempFood['id'] = parseInt(response.lists[i]['foodId']);
             this.tempFood['meal'] = response.lists[i]['meal'];
             this.foods.push(this.tempFood);
          }
          
        });
    } catch (error) {
      this.toast.danger('', Messages.WRONG);
    }
  }

  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (
      (charCode > 31 && (charCode < 46 || charCode > 57))) {
      return false;
    }
    return true;
  }

  addFood(food) {
    if(food.actualIntake > 0){
     food.selected = !food.selected;
     // tslint:disable-next-line
     this.selectedFoods.push(food);
    }
    
  }
}
