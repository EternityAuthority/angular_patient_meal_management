import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ROLES } from '../../@auth/roles';
import { AuthService } from '../Services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminauthGuard implements CanActivate {
  constructor(private authService: AuthService) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const user = JSON.parse(atob((localStorage.getItem('myAuthDetail'))));
    if (user && user.userType === ROLES.ADMIN) {
      return true;
    }
    else {
      return false;
    }
  }
}
