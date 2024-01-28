import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
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
      throw new Error('SREV-POST-99: Se espera un archivo (File) o una cadena (string).');
    }

    return this.http.post<any>(url, formData).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  getData(data: File | string | undefined): Observable<any> {
    const formData = new FormData();
    const url = `seismic_data/`;

    if (typeof data === 'string') {
      formData.append('data', data);
    } else {
      throw new Error('SREV-GET-00: Se espera un archivo datos para Lectura');
    }

    return this.http.post<any>(url, formData).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  getPlotStation(data: string, station_selected: string, channel_selected: string): Observable<any> {
    const formData = new FormData();
    const url = 'plot/'

    if (typeof data === 'string') {
      formData.append('data', data);
      formData.append('station_selected', station_selected)
      formData.append('channel_selected', channel_selected)
    } else {
      throw new Error('SREV-GET-01: Se espera un archivo datos para Lectura');
    }

    return this.http.post<any>(url, formData).pipe(
      catchError(error => {
        return of(error)
      })
    );

  }

  getTraceData(data: string, station_selected: string, channel_selected: string): Observable<any> {
    const formData = new FormData();
    const url = 'trace_data/'

    if (typeof data === 'string') {
      formData.append('data', data);
      formData.append('station_selected', station_selected)
      formData.append('channel_selected', channel_selected)
    } else {
      throw new Error('SREV-GET-02: Se espera un archivo datos para Lectura');
    }

    return this.http.post<any>(url, formData).pipe(
      catchError(error => {
        return of(error)
      })
    );

  }

  getTraceDataBaseLine(
    data: string, 
    station_selected: string, 
    channel_selected: string, 
    base_line: string, 
    filter: string, 
    freqmin: string, 
    freqmax: string, 
    corner: string, 
    t_min: string, 
    t_max: string): Observable<any> {
    const formData = new FormData();
    const url = 'trace_baseline_data/'

    if (typeof data === 'string') {
      formData.append('data', data);
      formData.append('station_selected', station_selected)
      formData.append('channel_selected', channel_selected)
      formData.append('base_line', base_line)
      formData.append('filter_type', filter)
      formData.append('freq_min', freqmin)
      formData.append('freq_max', freqmax)
      formData.append('corner', corner)
      formData.append('t_min', t_min)
      formData.append('t_max', t_max)
    } else {
      throw new Error('SREV-GET-03: Se espera un archivo datos para Lectura');
    }

    return this.http.post<any>(url, formData).pipe(
      catchError(error => {
        return of(error)
      })
    );

  }

  getTraceDataFilter( 
    data: string, 
    station_selected: string, 
    channel_selected: string, 
    base_line: string, 
    filter: string, 
    freqmin: string, 
    freqmax: string, 
    corner: string, 
    t_min: string, 
    t_max: string): Observable<any> {
    const formData = new FormData();
    const url = 'trace_filter_data/'

    if (typeof data === 'string') {
      formData.append('data', data);
      formData.append('station_selected', station_selected)
      formData.append('channel_selected', channel_selected)
      formData.append('base_line', base_line)
      formData.append('filter_type', filter)
      formData.append('freq_min', freqmin)
      formData.append('freq_max', freqmax)
      formData.append('corner', corner)
      formData.append('t_min', t_min)
      formData.append('t_max', t_max)
    } else {
      throw new Error('SREV-GET-04: Se espera un archivo datos para Lectura');
    }

    return this.http.post<any>(url, formData).pipe(
      catchError(error => {
        return of(error)
      })
    );

  }

  getTraceDataTrim(
    data: string, 
    station_selected: string, 
    channel_selected: string, 
    base_line: string, 
    filter: string, 
    freqmin: string, 
    freqmax: string, 
    corner: string, 
    t_min: string, 
    t_max: string): Observable<any> {
    const formData = new FormData();
    const url = 'trace_trim_data/'

    if (typeof data === 'string') {
      formData.append('data', data);
      formData.append('station_selected', station_selected)
      formData.append('channel_selected', channel_selected)
      formData.append('base_line', base_line)
      formData.append('filter_type', filter)
      formData.append('freq_min', freqmin)
      formData.append('freq_max', freqmax)
      formData.append('corner', corner)
      formData.append('t_min', t_min)
      formData.append('t_max', t_max)
    } else {
      throw new Error('SREV-GET-05: Se espera un archivo datos para Lectura');
    }

    return this.http.post<any>(url, formData).pipe(
      catchError(error => {
        return of(error)
      })
    );

  }

}
