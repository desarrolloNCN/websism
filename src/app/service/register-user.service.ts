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

  mseedListCalibration(userId: number, net?: string, sta?: string, loc?: string ) : Observable<any> {
    const url = `mseed_list_user/`

    const data = {
      "user": userId,
      "network": net,
      "station": sta,
      "location": loc
    }

    return this.http.post<any>(url, data).pipe(
      catchError(error => {
        return of(error)
      })
    );
  }

  addCalibrationMseedUser(mseed:string, xml:string, dataCal: any){
    const url = `mseed_xml_user/`

    //TODO : CAMBIAR USER ID

    const data = {
      "user" : 1,
      "mseed_file" : mseed ,
      "xml_file" : xml,
      "calib_factor": dataCal
    }

    return this.http.post<any>(url, data).pipe(
      catchError(error => {
        return of(error)
      })
    );
  }

}
