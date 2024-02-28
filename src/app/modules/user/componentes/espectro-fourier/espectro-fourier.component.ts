import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ObspyAPIService } from 'src/app/service/obspy-api.service';
import { VisorGraphComponent } from '../../pages/visor-graph/visor-graph.component';

@Component({
  selector: 'app-espectro-fourier',
  templateUrl: './espectro-fourier.component.html',
  styleUrls: ['./espectro-fourier.component.css']
})
export class EspectroFourierComponent implements OnInit {

  trace1: any = {}
  data : any= []
  layout: any = {}
  config: any = {}

  loadingSpinnerGraph = false
  loadedPlot = false

  constructor(
    private matDialogRef: MatDialogRef<VisorGraphComponent>,
    private obsApi: ObspyAPIService,
    @Inject(MAT_DIALOG_DATA) public dataFourier: any
  ) { }

  ngOnInit(): void {
    this.matDialogRef.updateSize('40%', 'auto')
    this.loadingSpinnerGraph = true
    
    this.loadGraph()
  }

  loadGraph(){
    this.obsApi.createFourierEspc(this.dataFourier.url, this.dataFourier.station, this.dataFourier.channel).subscribe({
      next: value => {

        this.trace1 = {
          type: "scatter",
          mode: "lines",
          name: 'AAPL High',
          x: value.periodo,
          y: value.amplitud,
          line: { color: '#31456D' }
        }
      
      
        this.data = [this.trace1];
      
        this.layout = {
          title: 'Espectro de Fourier (5% Amortiguamiento)',
          xaxis: {
            title: 'Periodo [s]',
            type: 'log',
            autorange: true,
            exponentformat: 'e',
            showexponent: 'all',
            range: [0.01, 10]
          },
          yaxis: {
            title: 'Aceleracion Espectral [cm/s2]',
          },
      
        };
      
        this.config = {
          displaylogo: false,
          responsive: true
        }

      },
      error: err => { },
      complete: () => {
        this.loadingSpinnerGraph = false 
        this.loadedPlot = true
      }
    })
  }

  Close() {
    let respData = {
      "url": '',
      "unit": ''
    }
    this.matDialogRef.close(respData)
  }

}
