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
import { environment } from 'src/environments/environment';

@Injectable()
export class HttpHeadersInterceptor implements HttpInterceptor {
  private user = 'admin'
  private pass = 'admin'

  private baseUrl = environment.baseUrl

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.headers.has('No-Interceptor')) {
      const newHeaders = req.headers.delete('No-Interceptor');
      const newReq = req.clone({ headers: newHeaders });
      return next.handle(newReq);
    }

    const newUrl = `https://apiqs.ncn.pe/${req.url}`;
    //const newUrl = `http://localhost:8000/${req.url}`;
    //const newUrl = `${this.baseUrl}${req.url}`;

    let modifiedReq = req.clone({ url: newUrl });

    if (!modifiedReq.headers.has('Authorization')) {
      const authHeader = 'Basic ' + btoa(`${this.user}:${this.pass}`);
      modifiedReq = modifiedReq.clone({
        setHeaders: { Authorization: authHeader }
      });
    }

    return next.handle(modifiedReq);


    // if (!req.headers.has('Authorization')) {
    //   const authHeader = 'Basic ' + btoa(`${this.user}:${this.pass}`);
    //   req = req.clone({
    //     setHeaders: {
    //       Authorization: authHeader,

    //     },
    //     // url: `http://pedro.ncn.pe:8000/${req.url}`
    //      url: `https://apiqs.ncn.pe/${req.url}`
    //     //url: `http://localhost:8000/${req.url}`
    //     // url: `http://192.168.1.42:8000/${req.url}`
    //   });
    // }

    // // Continúa con la solicitud modificada
    // return next.handle(req);
  }

}
