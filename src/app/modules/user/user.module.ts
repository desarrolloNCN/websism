import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VisorGraphComponent } from './pages/visor-graph/visor-graph.component';
import { NgxEchartsModule } from 'ngx-echarts';


@NgModule({
  declarations: [
    HomeComponent,
    VisorGraphComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FlexLayoutModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgxEchartsModule.forChild(),
  ]
})
export class UserModule { }
