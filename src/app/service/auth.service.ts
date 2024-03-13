import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  getToken(): Observable<any> {

    const url = `https://qs.ncn.pe/site/authjoom.inc.php`;

    const headers = new HttpHeaders().set('No-Interceptor', 'true');

    return this.http.get<any>(url, { headers }).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  testAuth(): Observable<any> {
    const url = 'authT/'

    return this.http.get<any>(url).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    )
  }

  nUser(username: string, email: string): Observable<any> {

    const url = 'user/'

    const sendData = {
      "username": username,
      "email": email
    }

    return this.http.post<any>(url, sendData).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    )
  }

}
