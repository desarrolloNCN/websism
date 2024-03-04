import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxEchartsModule } from 'ngx-echarts';

import { VisorGraphComponent } from './pages/visor-graph/visor-graph.component';
import { UserProjectsComponent } from './pages/user-projects/user-projects.component';
import { AmplitudFourierComponent } from './componentes/amplitud-fourier/amplitud-fourier.component';
import { EspectroFourierComponent } from './componentes/espectro-fourier/espectro-fourier.component';
import { PlotlyViaCDNModule } from 'angular-plotly.js';

// import * as PlotlyJS from 'plotly.js-dist-min';
// import { PlotlyModule } from 'angular-plotly.js';

PlotlyViaCDNModule.setPlotlyVersion('1.55.2'); 
PlotlyViaCDNModule.setPlotlyBundle('basic');

// PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    HomeComponent,
    VisorGraphComponent,
    UserProjectsComponent,
    AmplitudFourierComponent,
    EspectroFourierComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    FlexLayoutModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgxEchartsModule.forChild(),
    PlotlyViaCDNModule
  ],
  providers: [
    DatePipe,
    DecimalPipe
  ],
})
export class UserModule { }
