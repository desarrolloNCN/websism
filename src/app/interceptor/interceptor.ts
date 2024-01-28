// http-interceptor.ts

import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpHeaders,
  HttpResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class HttpHeadersInterceptor implements HttpInterceptor {
  private user = 'admin'
  private pass = 'admin'

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (!req.headers.has('Authorization')) {
      const authHeader = 'Basic ' + btoa(`${this.user}:${this.pass}`);
      req = req.clone({
        setHeaders: {
          Authorization: authHeader,
          
        },
        // url: `http://pedro.ncn.pe:8000/${req.url}`
        // url: `https://apiqs.ncn.pe/${req.url}`
         url: `http://localhost:8000/${req.url}`
        //url: `http://192.168.1.42:8000/${req.url}`
      });
    }

    // Continúa con la solicitud modificada
    return next.handle(req);
  }
  
}
