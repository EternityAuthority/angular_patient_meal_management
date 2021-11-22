/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, pipe, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoadingService } from '../pages/Services/loading.service';
import { AuthService } from '../pages/Services/auth.service';
import { NbToastrService } from '@nebular/theme';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private load: LoadingService,
    private auth: AuthService, private toast: NbToastrService,  private spinner: NgxSpinnerService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // this.load.setLoadingStatus(true);
    this.spinner.show();
    const token = localStorage.getItem('myAuthToken') ? localStorage.getItem('myAuthToken') : null;
    if (token) {

      req = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token
        }
      });
    }

    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // this.load.setLoadingStatus(false);
          this.spinner.hide();
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.toast.danger('You have been logged out', 'Invalid token');
          this.auth.logOut();
        }
        // TODO: handle 403 error ?
        // this.load.setLoadingStatus(false);
        this.spinner.hide();
        return throwError(error);
      }));
  }
}
