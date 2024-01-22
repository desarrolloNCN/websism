import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UextRoutingModule } from './uext-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from 'src/app/material/material.module';
import { UserHomeComponent } from './pages/user-home/user-home.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LectorDemoComponent } from './pages/lector-demo/lector-demo.component';
import { NavBarComponent } from './componentes/nav-bar/nav-bar.component';
import { FooterBarComponent } from './componentes/footer-bar/footer-bar.component';
import { NgxEchartsModule } from 'ngx-echarts';


@NgModule({
  declarations: [
    UserHomeComponent,
    LectorDemoComponent,
    NavBarComponent,
    FooterBarComponent
  ],
  imports: [
    CommonModule,
    UextRoutingModule,
    FlexLayoutModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgxEchartsModule.forChild(),
  ]
})
export class UextModule { }
