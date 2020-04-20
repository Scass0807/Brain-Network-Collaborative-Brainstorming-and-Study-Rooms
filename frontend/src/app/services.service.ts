import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor(private http: HttpClient) { }
  baseUrl = 'http://localhost:3000';

  login(loginData): Observable<ApiResponse>  {
    return this.http.post<ApiResponse>(this.baseUrl + '/auth/login', loginData);
  }

}
