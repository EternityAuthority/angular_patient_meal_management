import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { CategoryClient, ICategory, IPlan, PlanClient } from '../../../Nutricalc-api';

@Injectable({
  providedIn: 'root'
})
export class PlansService {

  plans$: Observable<IPlan[]>;

  categories$: Observable<ICategory[]>;

  constructor(private plan: PlanClient,
    private category: CategoryClient) { }

  getPlans(): Observable<any> {
    if (!this.plans$) {
      this.plans$ = this.requestPlans().pipe(
        shareReplay(1)
      );
    }
    return this.plans$;
  }

  requestPlans() {
    return this.plan.get().pipe(
      map(response => response.lists)
    );
  }

  getNutrients(): Observable<any> {
    if (!this.categories$) {
      this.categories$ = this.requestNutrients().pipe(
        shareReplay(1)
      );
    }
    return this.categories$;
  }

  requestNutrients() {
    return this.category.get().pipe(
      map(response => response.lists)
    );
  }


}
