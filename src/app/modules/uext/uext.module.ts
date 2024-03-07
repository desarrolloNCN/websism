import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

import { UextRoutingModule } from './uext-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from 'src/app/material/material.module';
import { UserHomeComponent } from './pages/user-home/user-home.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LectorDemoComponent } from './pages/lector-demo/lector-demo.component';
import { NavBarComponent } from './componentes/nav-bar/nav-bar.component';
import { FooterBarComponent } from './componentes/footer-bar/footer-bar.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { MatTabsModule } from '@angular/material/tabs';
import { UserLoginComponent } from './pages/user-login/user-login.component';
import { ArchivoTXTComponent } from './componentes/archivo-txt/archivo-txt.component';
import { ArchivoMseedComponent } from './componentes/archivo-mseed/archivo-mseed.component';
import { RegisterDialogComponent } from './componentes/register-dialog/register-dialog.component';
import { ImageViewerModule } from 'ngx-image-viewer';
import { SismosHistoricosComponent } from './componentes/sismos-historicos/sismos-historicos.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';



@NgModule({
  declarations: [
    UserHomeComponent,
    LectorDemoComponent,
    NavBarComponent,
    FooterBarComponent,
    UserLoginComponent,
    ArchivoTXTComponent,
    ArchivoMseedComponent,
    RegisterDialogComponent,
    SismosHistoricosComponent,
    AboutUsComponent
  ],
  imports: [
    CommonModule,
    UextRoutingModule,
    FlexLayoutModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgxEchartsModule.forChild(),
    ImageViewerModule.forRoot()
  ],
  providers: [
    DecimalPipe,
  ],
})
export class UextModule { }
