import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { Observable, catchError, map, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObspyAPIService {

  headers = {}

  constructor(private http: HttpClient) { }


  uploadFile(data: File | string | undefined, ip?: string): Observable<any> {


    const formData = new FormData();
    const url = `upload/`;

    if (data instanceof File) {
      formData.append('file', data);
      formData.append('info', ip || '')
    } else if (typeof data === 'string') {
      formData.append('string_data', data);
      formData.append('info', ip || '')
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
    unit?: string,
    color_graph?: string
  ): Observable<any> {

    const formData = new FormData();

    const url = 'trace_data/'

    unit = unit || ''

    if (typeof data === 'string') {
      formData.append('data', data);
      formData.append('station_selected', station_selected)
      formData.append('channel_selected', channel_selected)
      formData.append('unit', unit)
      formData.append('graph_color', color_graph || '')
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
    unit_from: string,
    unit_to: string,
    color_graph?: string
  ): Observable<any> {
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
      formData.append('unit_from', unit_from)
      formData.append('unit_to', unit_to)
      formData.append('graph_color', color_graph || '')
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
    unit_from: string,
    unit_to: string,
    color_graph?: string
  ): Observable<any> {
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
      formData.append('unit_from', unit_from)
      formData.append('unit_to', unit_to)
      formData.append('graph_color', color_graph || '')
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
    unit_from: string,
    unit_to: string,
    color_graph?: string
  ): Observable<any> {
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
      formData.append('unit_from', unit_from)
      formData.append('unit_to', unit_to)
      formData.append('graph_color', color_graph || '')
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
    unit_from: string,
    unit_to: string,
    color_graph?: string
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
      formData.append('unit_from', unit_from)
      formData.append('unit_to', unit_to)
      formData.append('graph_color', color_graph || '')
    } else {
      throw new Error('SREV-GET-03: Se espera un archivo datos para Lectura');
    }

    return this.http.post<any>(url, formData).pipe(
      catchError(error => {
        return of(error)
      })
    );

  }

  convertToStream(data: any) {
    const url = 'convert_stream/'
    const sendData = { data }

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
    unit: string,
    base_line?: string,
    filter?: string,
    freqmin?: string,
    freqmax?: string,
    corner?: string,
    zero?: string,
    t_min?: string,
    t_max?: string,
    color_graph?: string
  ): Observable<any> {
    const formData = new FormData();
    const url = 'auto-adjust/'

    base_line = '',
      filter = '',
      freqmin = '',
      freqmax = '',
      corner = '',
      zero = '',
      t_min = '',
      t_max = ''

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
      formData.append('unit_from', unit)
      formData.append('graph_color', color_graph || '')
    } else {
      throw new Error('SREV-GET-04: Se espera un archivo datos para Lectura');
    }

    return this.http.post<any>(url, formData).pipe(
      catchError(error => {
        return of(error)
      })
    );

  }

  addCalibrationMseed(mseed: string, xml: string, dataCal: any) {
    const url = `calibration/`

    const data = {
      "mseed_file": mseed,
      "xml_file": xml,
      "calib_factor": dataCal
    }

    return this.http.post<any>(url, data).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  createFourier(
    data: string,
    station: string,
    channel: string,
    tmin: string,
    tmax: string
  ) {

    const url = 'fourier/'

    let senData = {
      "data": data,
      "station_selected": station,
      "channel_selected": channel,
      "t_min": tmin,
      "t_max": tmax
    }

    return this.http.post<any>(url, senData).pipe(
      catchError(error => {
        return of(error)
      })
    );

  }

  createFourierEspc(
    data: string,
    station: string,
    channel: string,
    tmin: string,
    tmax: string
  ) {

    const url = 'espectro-fourier/'

    let senData = {
      "data": data,
      "station_selected": station,
      "channel_selected": channel,
      "t_min": tmin,
      "t_max": tmax
    }

    return this.http.post<any>(url, senData).pipe(
      catchError(error => {
        return of(error)
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

  testuser() {
    const url = `users/`

    return this.http.get<any>(url).pipe(
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  plotGraph(data: string,
    station_selected: string,
    channel_selected: string,
    unit?: string,
    color_graph?: string,
    widthGraph?: string
  ): Observable<any> {

    const formData = new FormData();

    const url = 'plot/'

    unit = unit || ''

    if (typeof data === 'string') {
      formData.append('data', data);
      formData.append('station_selected', station_selected)
      formData.append('channel_selected', channel_selected)
      formData.append('unit_from', unit)
      formData.append('width', widthGraph || "0.3")
      formData.append('graph_color', color_graph || '')
    } else {
      throw new Error('SREV-GET-02: Se espera un archivo datos para Lectura');
    }

    return this.http.post<any>(url, formData).pipe(
      catchError(error => {
        return of(error)
      })
    );

  }

  plotToolGraph(
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
    unit_from: string,
    unit_to: string,
    color_graph?: string,
    widthGraph?: string
  ): Observable<any> {
    const formData = new FormData();
    const url = 'plot-tool/'

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
      formData.append('unit_from', unit_from)
      formData.append('unit_to', unit_to)
      formData.append('graph_color', color_graph || '')
      formData.append('width', widthGraph || "0.3")
    } else {
      throw new Error('SREV-GET-03: Se espera un archivo datos para Lectura');
    }

    return this.http.post<any>(url, formData).pipe(
      catchError(error => {
        return of(error)
      })
    );

  }

  plotToolauto(
    data: string,
    station_selected: string,
    channel_selected: string,
    unit: string,
    color_graph?: string,
    base_line?: string,
    filter?: string,
    freqmin?: string,
    freqmax?: string,
    corner?: string,
    zero?: string,
    t_min?: string,
    t_max?: string,
    widthGraph?: string
  ): Observable<any> {
    const formData = new FormData();
    const url = 'plot-tool-auto/'

    base_line = ''
    filter = ''
    freqmin = ''
    freqmax = ''
    corner = ''
    zero = ''


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
      formData.append('t_min', t_min || '')
      formData.append('t_max', t_max || '')
      formData.append('unit_from', unit)
      formData.append('graph_color', color_graph || '')
      formData.append('width', widthGraph || "0.3")
    } else {
      throw new Error('SREV-GET-04: Se espera un archivo datos para Lectura');
    }

    return this.http.post<any>(url, formData).pipe(
      catchError(error => {
        return of(error)
      })
    );

  }

  downloadImage(url: string, name: string) {
    const imageUrl = url;
    const headers = new HttpHeaders().set('No-Interceptor', 'true');

    this.http.get(imageUrl, { responseType: 'blob', headers })
      .subscribe((response: Blob) => {
        const blob = new Blob([response], { type: 'image/png' });
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.download = `${name}.png`;
        anchor.href = url;
        anchor.click();
        window.URL.revokeObjectURL(url);
      });
  }

  getIpAddress() {
    const headers = new HttpHeaders().set('No-Interceptor', 'true');
    const url = 'https://api.ipify.org?format=json'
    return this.http.get(url, { headers }).pipe(
      catchError(error => {
        return of(error)
      })
    );
  }

  showAlert() {
    const url = 'alert/'
    
    return this.http.get<any>(url).pipe(
      catchError(error => {
        return of(error)
      })
    );
  }

}

