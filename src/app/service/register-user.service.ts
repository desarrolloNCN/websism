import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of, throwError } from 'rxjs';

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

  addCalibrationMseedUser(user:number, mseed:string, xml:string, dataCal: any){
    const url = `mseed_xml_user/`

    const data = {
      "user" : user,
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

  uploadFileUser(data: File | string | undefined, iduser?: string): Observable<any> {


    const formData = new FormData();

    const url = `upload_user/`;

    if (data instanceof File) {
      formData.append('user', iduser!)
      formData.append('file', data);
    } else if (typeof data === 'string') {
      formData.append('string_data', data);
    } else {
      throw new Error('SREV-POST-99: Se espera un archivo (File) o una cadena (string).');
    }

    return this.http.post<any>(url, formData).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

}
