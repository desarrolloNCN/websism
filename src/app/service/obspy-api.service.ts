import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObspyAPIService {

  private baseUrl = environment.baseUrl;
  private user = 'admin'
  private pass = 'admin'

  constructor(private http: HttpClient) { }

  postFicha(sFile: File): Observable<any> {
    const formData = new FormData()

    formData.append('file', sFile)

    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${this.user}:${this.pass}`)
    })

    const url = `${this.baseUrl}seismic_data/`

    return this.http.post<any>(url, formData)
  }

}
