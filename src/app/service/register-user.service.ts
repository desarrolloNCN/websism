import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterUserService {

  constructor(private http: HttpClient) { }

  getProjectUser(userid: any): Observable<any> {
    const url = `/snippets/?user=${userid}`

    return this.http.get<any>(url).pipe(
      catchError(error => {
        return of(error)
      })
    );
  }

  postProjectUser(userid: any): Observable<any> {
    const url = `/proyecto/`
    const data = {
      "user" : userid
    }
    return this.http.post<any>(url, data).pipe(
      catchError(error => {
        return of(error)
      })
    );
  }

}
