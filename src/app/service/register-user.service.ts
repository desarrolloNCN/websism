import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterUserService {

  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }


  mseedListCalibration(userId: number, net?: string, sta?: string, loc?: string): Observable<any> {
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

  addCalibrationMseedUser(user: number, mseed: string, xml: string, dataCal: any) {
    const url = `mseed_xml_user/`

    const data = {
      "user": user,
      "mseed_file": mseed,
      "xml_file": xml,
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
      formData.append('user', iduser!)
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

  newProject(username: string, email: string): Observable<any> {
    const url = `new_pro/`
    const sendData = {
      "username": username,
      "email": email
    }
    return this.http.post<any>(url, sendData).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  uploadProjectFileUser(data: File | string | undefined, iduser?: string, idproj?: string, unit?: string, status?: string, ext?: any): Observable<any> {
    const formData = new FormData();
    const url = `new_f_pro/`;
    let send = {}
    if (data instanceof File) {
      send = {
        "user": iduser!,
        "pro": idproj!,
        "file": data,
        "unit": unit,
        "status": status,
      }
      // formData.append('user', iduser!)
      // formData.append('pro', idproj!)
      // formData.append('file', data);
    } else if (typeof data === 'string') {
      send = {
        "user": iduser!,
        "pro": idproj!,
        "string_data": data,
        "unit": unit,
        "status": status,
      }
      // formData.append('user', iduser!)
      // formData.append('pro', idproj!)
      // formData.append('string_data', data);
    } else {
      throw new Error('SREV-POST: Se espera un archivo (File) o una cadena (String).');
    }

    return this.http.post<any>(url, send).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  delProject(idproj: string): Observable<any> {
    const url = `new_pro/?id=${idproj}`;

    return this.http.delete<any>(url).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  delFileProject(idFile: string): Observable<any> {
    const url = `new_f_pro/?id=${idFile}`;

    return this.http.delete<any>(url).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  sendData(data: any, route?: string) {
    this.router.navigate([route])
    this.dataSubject.next(data)
  }

  getProjectuser() {

  }

  putProject(idPro: string, name: String, desp: string) {
    const url = `new_pro/?id=${idPro}`
    const sendData = {
      "name": name,
      "desp": desp
    }
    return this.http.post<any>(url, sendData).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
}
