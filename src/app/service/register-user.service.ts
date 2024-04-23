import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, catchError, of, throwError } from 'rxjs';

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

  uploadProjectFileUser(data: File | string | undefined, iduser?: string, idproj?: string, filename?: string, status?: string): Observable<any> {
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
    this.dataSubject = new BehaviorSubject<any>(null);
    this.data = this.dataSubject.asObservable();
  }

  getProjectuser(user: string, email: string) {
    const url = `get_pro/`
    const sendData = {
      "username": user,
      "email": email
    }
    return this.http.post<any>(url, sendData).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  getProjectIdUser(idproj: string, user: string, email: string) {
    const url = `proid/?id=${idproj}`

    const sendData = {
      "username": user,
      "email": email
    }

    return this.http.post<any>(url, sendData).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  putProject(idPro: string, name: string, desp: string, img: File | string | undefined, merge: string) {
    const formData = new FormData();

    const url = `new_pro/?id=${idPro}`

    formData.append('name', name)
    formData.append('desp', desp)
    formData.append('merge', merge)

    if (img instanceof File) {
      formData.append('img_proj', img)
    } else {
      formData.append('img_proj', '')
    }

    return this.http.put<any>(url, formData).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  putFileProject(idFile: string, unit?: string, status?: string, ext?: any, file?: string) {
    const url = `new_f_pro/?id=${idFile}`

    const sendData = {
      "url_gen": file,
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

  putProjectTab(idPro: string, tab: any) {
    const url = `tab_pro/?id=${idPro}`

    const sendData = {
      "tab": tab
    }
    return this.http.put<any>(url, sendData).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  covertionXMR(file: File | string | undefined) {
    const url = `convert/`
    let formData = new FormData()

    if (file instanceof File) {
      formData.append('file', file);
    } else {
      throw new Error('SREV-POST-99: Se espera un archivo (File) o una cadena (string).');
    }

    return this.http.post<any>(url, formData).pipe(
      catchError(error => {
        return of(error)
      })
    );
  }

  mseedDownload(
    urls: any,
    info_sta: any,
    checked_sta: any,
    base_line: string,
    filter: string,
    freqmin: string,
    freqmax: string,
    corner: string,
    zero: string,
    t_min: string,
    t_max: string,
    unit_from: string,
    unit_to: string,
  ): Observable<any> {
    const formData = new FormData();
    const url = 'mseed/'

    formData.append('data', JSON.stringify(urls));
    formData.append('data_sta', JSON.stringify(info_sta))
    formData.append('check_sta', JSON.stringify(checked_sta))
    formData.append('base_line', base_line)
    formData.append('filter_type', filter)
    formData.append('freq_min', freqmin)
    formData.append('freq_max', freqmax)
    formData.append('corner', corner)
    formData.append('zero', zero)
    formData.append('t_min', t_min)
    formData.append('t_max', t_max)
    formData.append('unit_from', unit_from)
    formData.append('unit_to', unit_to)

    return this.http.post<any>(url, formData).pipe(
      catchError(error => {
        return of(error)
      })
    );

  }

}
