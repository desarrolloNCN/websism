import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserPanelComponent } from './layout/user-panel/user-panel.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';

import { HttpHeadersInterceptor } from './interceptor/interceptor';
import { NgxEchartsModule } from 'ngx-echarts';
import { OrderByPipe } from './pipe/ordenar.pipe';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';

@NgModule({
  declarations: [
    AppComponent,
    UserPanelComponent,
    OrderByPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    FlexLayoutModule,
    MaterialModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    RecaptchaModule,
    RecaptchaFormsModule
  ],
  exports: [
    OrderByPipe
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpHeadersInterceptor,
    multi: true
  },
  { provide: RECAPTCHA_V3_SITE_KEY, useValue: '6LdJMakpAAAAAB6T56n1KXEk7X6m1K4Y4o13zwte' },
],
  bootstrap: [AppComponent]
})
export class AppModule { }
