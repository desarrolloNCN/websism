import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable, catchError, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObspyAPIService {


  constructor(private http: HttpClient) { }


  uploadFile(data: File | string | undefined): Observable<any> {
    const formData = new FormData();
    const url = `upload/`;

    if (data instanceof File) {
      formData.append('file', data);
    } else if (typeof data === 'string') {
      formData.append('string_data', data);
    } else {
      throw new Error('SREV-POST: Se espera un archivo (File) o una cadena (string).');
    }

    return this.http.post<any>(url, formData).pipe(
      catchError(error => {
        return of(error)
      })
    );
  }

  getData(data: File | string | undefined): Observable<any> {
    const formData = new FormData();
    const url = `seismic_data/`;

    if (typeof data === 'string') {
      formData.append('data', data);
    } else {
      throw new Error('SREV-GET: Se espera un archivo datos para Lectura');
    }

    return this.http.post<any>(url, formData).pipe(
      catchError(error => {
        return of(error)
      })
    );
  }

  getPlotStation(data: string, station_selected : string, channel_selected: string) :Observable<any>{
    const formData = new FormData();
    const url = 'plot/'

    if (typeof data === 'string') {
      formData.append('data', data);
      formData.append('station_selected', station_selected)
      formData.append('channel_selected', channel_selected)
    } else {
      throw new Error('SREV-GET: Se espera un archivo datos para Lectura');
    }

    return this.http.post<any>(url, formData).pipe(
      catchError(error => {
        return of(error)
      })
    ); 

  }

}
