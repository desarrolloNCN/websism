import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterUserService {

  private dataSubject = new BehaviorSubject<any>(null);
  data = this.dataSubject.asObservable();

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

  uploadProjectFileUser(data: File | string | undefined, iduser?: string, idproj?: string, filename?: string, status? : string): Observable<any> {
    const formData = new FormData();
    const url = `new_f_pro/`;


    if (data instanceof File) {
      formData.append('user', iduser!)
      formData.append('pro', idproj!)
      formData.append('file', data);
      formData.append('filename', filename || '');
      formData.append('status', status || '');
    } else if (typeof data === 'string') {
      formData.append('user', iduser!)
      formData.append('pro', idproj!)
      formData.append('string_data', data);
      formData.append('filename', filename || '');
      formData.append('status', status || '');
    } else {
      throw new Error('SREV-POST: Se espera un archivo (File) o una cadena (String).');
    }

    return this.http.post<any>(url, formData).pipe(
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

  resetService() {
    this.dataSubject.next(null);
  }

  getProjectuser(user:string, email:string) {
    const url = `pro/`
    
    const sendData = {
      "username" : user,
      "email": email
    }

    return this.http.post<any>(url, sendData).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  getProjectIdUser(idproj: string, user:string, email:string) {
    const url = `proid/?id=${idproj}`
    
    const sendData = {
      "username" : user,
      "email": email
    }

    return this.http.post<any>(url, sendData).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  putProject(idPro: string, name: String, desp: string) {
    const url = `new_pro/?id=${idPro}`
    
    const sendData = {
      "name": name,
      "desp": desp
    }
    return this.http.put<any>(url, sendData).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  putFileProject(idFile: string,  unit?: string, status?: string, ext?: any, file?: string ) {
    const url = `new_f_pro/?id=${idFile}`

    const sendData = {
      "string_data": file,
      "unit": unit,
      "status": status,
      "extra": ext
    }

    return this.http.put<any>(url, sendData).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
}
