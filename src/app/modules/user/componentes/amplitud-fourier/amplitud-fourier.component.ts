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
  data: any = []
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

  async loadGraph() {

    let url = this.dataFourier.url
    let sta = this.dataFourier.station
    let cha = this.dataFourier.channel

    this.obsApi.createFourier(url, sta, cha).subscribe({
      next: value => {

        this.trace1 = {
          type: "scatter",
          mode: "lines",
          name: 'Fourier',
          x: value.periodo,
          y: value.amplitud,
          line: { color: '#31456D' }
        }


        this.data = [this.trace1];

        this.layout = {
          title: 'Amplitud de Fourier [cm/s]',
          
          images: [{
            name: 'NCN Nuevo Control',
            source: 'https://ncn.pe/wp-content/uploads/2023/09/Logo_NCN_1-1.jpg',
            opacity: 0.1,
            layer: "below"
          }],
          xaxis: {
            title: 'Periodo [s]',
            type: 'log',
            range: [-2, 1],
          },
          yaxis: {
            title: 'Amplitud [cm/s]',
            type: 'log',
            exponentformat: 'e',
            showexponent: 'all',

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
