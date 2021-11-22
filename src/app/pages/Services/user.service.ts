import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { share } from 'rxjs/operators';

export interface IBusiness {
  plan?: number;
  id?: string;
  companyName?: string | undefined;
  contactFirstName?: string | undefined;
  contactLastName?: string | undefined;
  contactEmail?: string | undefined;
  contactPhone?: string | undefined;
  planExpiryDate?: Date;
  websiteUrl: string;
  qualification: string;
  filePath: string;
  balance: number;
}

export interface IAdmin {
  plan?: number;
  id?: string;
  companyName?: string | undefined;
  contactFirstName?: string | undefined;
  contactLastName?: string | undefined;
  contactEmail?: string | undefined;
  contactPhone?: string | undefined;
  planExpiryDate?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: IBusiness;
  currentUser$ = new BehaviorSubject(this.user);

  adminUser: IAdmin;
  currentAdminUser$ = new BehaviorSubject(this.adminUser);

  constructor() { }

  getUser(): IBusiness {
    return this.currentUser$.value;
  }

  getAdmin(): IAdmin {
    return this.currentAdminUser$.value;
  }

  setUser(paramUser: IBusiness) {
    this.user = paramUser;
    this.changeUserState(paramUser);
  }

  setAdmin(paramUser: IAdmin) {
    this.adminUser = paramUser;
    this.changeAdminState(paramUser);
  }

  onUserStateChange() {
    return this.currentUser$.pipe(share());
  }

  onAdminStateChange() {
    return this.currentAdminUser$.pipe(share());
  }

  changeUserState(paramUser: IBusiness) {
    this.currentUser$.next(paramUser);
  }

  changeAdminState(paramUser: IAdmin) {
    this.currentAdminUser$.next(paramUser);
  }
}
