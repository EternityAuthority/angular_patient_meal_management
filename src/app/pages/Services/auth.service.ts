import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private user: UserService) { }

  isAuthenticated(): Observable<boolean> {
    if (localStorage.getItem('myAuthToken')) {
      return of(true);
    }
    else {
      return of(false);
    }
  }

  logOut() {
    this.user.setUser(null);
    localStorage.removeItem('myAuthToken');
    localStorage.removeItem('myAuthDetail');
    this.router.navigate(['/auth/login']);
  }
}
