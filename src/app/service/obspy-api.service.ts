import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { Observable, catchError, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObspyAPIService {

  headers = {}

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

  getTraceData(
    data: string, 
    station_selected: string, 
    channel_selected: string,
    unit?:string
    ): Observable<any> {

    const formData = new FormData();
    
    const url = 'trace_data/'

    unit = unit || ''

    if (typeof data === 'string') {
      formData.append('data', data);
      formData.append('station_selected', station_selected)
      formData.append('channel_selected', channel_selected)
      formData.append('unit', unit)
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
    zero: string, 
    t_min: string, 
    t_max: string,
    unit: string): Observable<any> {
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
      formData.append('zero', zero)
      formData.append('t_min', t_min)
      formData.append('t_max', t_max)
      formData.append('unit', unit)
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
    zero: string, 
    t_min: string, 
    t_max: string,
    unit: string): Observable<any> {
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
      formData.append('zero', zero)
      formData.append('t_min', t_min)
      formData.append('t_max', t_max)
      formData.append('unit', unit)
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
    zero: string, 
    t_min: string, 
    t_max: string,
    unit: string): Observable<any> {
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
      formData.append('zero', zero)
      formData.append('t_min', t_min)
      formData.append('t_max', t_max)
      formData.append('unit', unit)
    } else {
      throw new Error('SREV-GET-05: Se espera un archivo datos para Lectura');
    }

    return this.http.post<any>(url, formData).pipe(
      catchError(error => {
        return of(error)
      })
    );

  }

  unitConvertion(
    data: string, 
    station_selected: string, 
    channel_selected: string, 
    base_line: string, 
    filter: string, 
    freqmin: string, 
    freqmax: string, 
    corner: string, 
    zero: string, 
    t_min: string, 
    t_max: string,
    unit: string
    ): Observable<any> {
    const formData = new FormData();
    const url = 'convert-unit/'

    if (typeof data === 'string') {
      formData.append('data', data);
      formData.append('station_selected', station_selected)
      formData.append('channel_selected', channel_selected)
      formData.append('base_line', base_line)
      formData.append('filter_type', filter)
      formData.append('freq_min', freqmin)
      formData.append('freq_max', freqmax)
      formData.append('corner', corner)
      formData.append('zero', zero)
      formData.append('t_min', t_min)
      formData.append('t_max', t_max)
      formData.append('unit', unit)
    } else {
      throw new Error('SREV-GET-03: Se espera un archivo datos para Lectura');
    }

    return this.http.post<any>(url, formData).pipe(
      catchError(error => {
        return of(error)
      })
    );

  }

  convertToStream(data : any){
    const url = 'convert_stream/'
    const sendData = {data} 

    return this.http.post<any>(url, sendData).pipe(
      catchError(error => {
        return of(error)
      })
    );
  }

  autoAdjust( 
    data: string, 
    station_selected: string, 
    channel_selected: string, 
    base_line?: string, 
    filter?: string, 
    freqmin?: string, 
    freqmax?: string, 
    corner?: string, 
    zero?: string, 
    t_min?: string, 
    t_max?: string,
    unit?: string): Observable<any> {
    const formData = new FormData();
    const url = 'auto-adjust/'

    base_line = '', 
    filter    = '', 
    freqmin   = '', 
    freqmax   = '', 
    corner    = '', 
    zero      = '', 
    t_min     = '', 
    t_max     = '',
    unit      = ''

    if (typeof data === 'string') {
      formData.append('data', data);
      formData.append('station_selected', station_selected)
      formData.append('channel_selected', channel_selected)
      formData.append('base_line', base_line)
      formData.append('filter_type', filter)
      formData.append('freq_min', freqmin)
      formData.append('freq_max', freqmax)
      formData.append('corner', corner)
      formData.append('zero', zero)
      formData.append('t_min', t_min)
      formData.append('t_max', t_max)
      formData.append('unit', unit)
    } else {
      throw new Error('SREV-GET-04: Se espera un archivo datos para Lectura');
    }

    return this.http.post<any>(url, formData).pipe(
      catchError(error => {
        return of(error)
      })
    );

  }

  addCalibrationMseed(mseed:string, xml:string, dataCal: any){
    const url = `calibration/`

    const data = {
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

