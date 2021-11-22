import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  loading: boolean = false;

  constructor(private http: HttpClient) { }

  getLoadingStatus(): boolean {
    return this.loading;
  }

  setLoadingStatus(status: boolean) {
    this.loading = status;
  }

  loadCountries(): Observable<any> {
    return this.http.get(`assets/data/countries.json`);
  }
}
