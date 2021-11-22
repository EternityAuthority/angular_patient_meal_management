import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { ClientClient, ClientFoodClient, UpdateClientFoodCommand } from '../../../Nutricalc-api';
import { Messages } from '../../Services/constants';
import { LoadingService } from '../../Services/loading.service';

@Component({
  selector: 'ngx-client-food-review',
  templateUrl: './client-food-review.component.html',
  styleUrls: ['./client-food-review.component.scss']
})
export class ClientFoodReviewComponent implements OnInit {

  clientGuid: string;
  // days: number[];
  clientFoodData: any[];
  // selectedDay: number = 1;
  // currentFoodList: any[];

  constructor(private food: ClientFoodClient, public load: LoadingService,
    private route: ActivatedRoute, private toast: NbToastrService,
    private client: ClientClient) {
    this.clientGuid = this.route.snapshot.queryParamMap.get('userId');
  }

  ngOnInit(): void {
    if (this.clientGuid) {
      this.getFoodInfo();
    }
  }

  getFoodInfo() {
    try {
      this.food.get(this.clientGuid).subscribe(res => {
        this.clientFoodData = res.lists;
        // const key = 'day';
        // const arrayUniqueByKey = [...new Map(res.lists.map(item =>
        //   [item[key], item])).values()];
        // this.days = arrayUniqueByKey.map(e => +e.day);
        // this.onDaySelect(1);
      });
    } catch (error) {
      this.toast.danger('', Messages.WRONG);
    }
  }

  // onDaySelect(day) {
  //   this.currentFoodList = this.clientFoodData.filter(e => e.day === day);
  // }

  submitFood() {
    let foodData: any[];
    if (this.clientFoodData.length > 0) {
      if (this.checkValidValues()) {
        foodData = this.clientFoodData.map(e => {
          return {
            'id': e.id,
            'clientId': this.clientGuid,
            'day': e.day,
            'actualIntake': +e.actualIntake
          };
        });
      }
      else {
        this.toast.danger('', 'Please enter valid values for food intake');
      }
    }
    if (foodData && foodData.length > 0) {
      try {
        this.client.update(<UpdateClientFoodCommand>{ clientFood: foodData }).subscribe(response => {
          if (response.succeeded) {
            this.toast.success('', 'Food details updated');
            this.getFoodInfo();
          }
          else if (!response.succeeded) {
            this.toast.danger('', response.errors);
          }
        });
      } catch (error) {
        this.toast.danger('', Messages.WRONG);
      }
    }
  }

  checkValidValues(): boolean {
    let a = 0;
    this.clientFoodData.forEach(e => {
      if (isNaN(e.actualIntake) || e.actualIntake <= 0 || e.actualIntake.toString().trim() === '') {
        a++;
      }
    });
    return a > 0 ? false : true;
  }

}
