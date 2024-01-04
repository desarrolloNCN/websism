import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObspyAPIService {

  private baseUrl = environment.baseUrl;


  constructor(private http: HttpClient) { }

  // postFicha(sFile: File): Observable<any> {
  //   const formData = new FormData()

  //   formData.append('file', sFile)

  //   const headers = new HttpHeaders({
  //     Authorization: 'Basic ' + btoa(`${this.user}:${this.pass}`)
  //   })

  //   const url = `${this.baseUrl}seismic_data/`

  //   return this.http.post<any>(url, formData)
  // }

  postFicha(data: File | string| undefined): Observable<any> {
    const formData = new FormData();

    if (data instanceof File) {
        formData.append('file', data);
    } else if (typeof data === 'string') {
        formData.append('data', data);
    } else {
        throw new Error('Se espera un archivo (File) o una cadena (string).');
    }
    const url = `seismic_data/`;

    return this.http.post<any>(url, formData);
}

}
