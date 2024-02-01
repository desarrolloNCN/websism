import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  getToken(): Observable<any>{

    const url = `https://qs.ncn.pe/site/authjoom.inc.php`;
    
    const headers = new HttpHeaders().set('No-Interceptor', 'true');

    return this.http.get<any>(url, {headers} ).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

}
