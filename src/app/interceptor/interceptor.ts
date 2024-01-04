// http-interceptor.ts

import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HttpHeadersInterceptor implements HttpInterceptor {
  private user = 'admin'
  private pass = 'admin'

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Interceptor Iniciado')
    if (!req.headers.has('Authorization')) {
      const authHeader = 'Basic ' + btoa(`${this.user}:${this.pass}`);
      req = req.clone({
        setHeaders: {
          Authorization: authHeader,
          
        },
        url: `http://pedro.ncn.pe:8000/${req.url}`
      });
    }

    // Continúa con la solicitud modificada
    return next.handle(req);
  }
}
