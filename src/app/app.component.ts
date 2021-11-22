/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROLES } from './@auth/roles';

@Component({
  selector: 'ngx-app',
  template: `<router-outlet></router-outlet><ngx-spinner bdColor="rgba(51,51,51,0.7)" size="large" color= "#fff" type="ball-clip-rotate" [fullScreen] = "true"
  > <p style="font-size: 20px; color: white">Please wait..</p></ngx-spinner>`,
})
export class AppComponent implements OnInit, OnDestroy {

  // private destroy$: Subject<void> = new Subject<void>();

  constructor(private router: Router) {

    this.intializeUser();
  }

  ngOnInit(): void {
    // this.analytics.trackPageViews();
  }

  intializeUser() {
    if (localStorage.getItem('myAuthDetail')) {
      const user = JSON.parse(atob(localStorage.getItem('myAuthDetail')));
      if (user && user.userType === ROLES.ADMIN) {
        this.router.navigate(['/pages/admin']);
      }
      else if (user && user.userType === ROLES.BUSINESS) {
        this.router.navigate(['/pages/business']);
      }
      else {
        this.router.navigate(['/auth/login']);
      }
    }
  }

  // initUser() {
  //   this.initUserService.initCurrentUser()
  //     .pipe(
  //       takeUntil(this.destroy$),
  //     )
  //     .subscribe();
  // }

  ngOnDestroy() {
    // this.destroy$.next();
    // this.destroy$.complete();
  }
}
