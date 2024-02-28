import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VisorGraphComponent } from '../../pages/visor-graph/visor-graph.component';
import { ObspyAPIService } from 'src/app/service/obspy-api.service';

@Component({
  selector: 'app-amplitud-fourier',
  templateUrl: './amplitud-fourier.component.html',
  styleUrls: ['./amplitud-fourier.component.css']
})
export class AmplitudFourierComponent implements OnInit {

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

  async loadGraph(){

    this.obsApi.createFourier(this.dataFourier.url, this.dataFourier.station, this.dataFourier.channel).subscribe({
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
          title: 'Amplitud de Fourier [cm/s]',
          xaxis: {
            title: 'Periodo [s]',
            type: 'log',
            autorange: true,
            exponentformat: 'e',
            showexponent: 'all',
            range: [0.01, 10]
          },
          yaxis: {
            title: 'Amplitud [cm/s]',
            type: 'log',
            autorange: true,
            exponentformat: 'e',
            showexponent: 'all',
            range: [0.001, 0.1]
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
