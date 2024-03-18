import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ObspyAPIService } from 'src/app/service/obspy-api.service';
import { VisorGraphComponent } from '../../pages/visor-graph/visor-graph.component';
import * as Plotly from 'plotly.js-dist-min';

@Component({
  selector: 'app-espectro-fourier',
  templateUrl: './espectro-fourier.component.html',
  styleUrls: ['./espectro-fourier.component.css']
})
export class EspectroFourierComponent implements OnInit {

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

  loadGraph() {

    let url = this.dataFourier.url
    let sta = this.dataFourier.station
    let cha = this.dataFourier.channel

    let allData = this.dataFourier.allData

    let net = this.dataFourier.allData.network
    let loc = this.dataFourier.allData.location

    this.obsApi.createFourierEspc(url, sta, cha).subscribe({
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
          title: 'Espectro de Respuesta (5% Amortiguamiento)',
          annotations: [
            {
              xref: 'paper',
              yref: 'paper',
              x: 0.5,
              y: 1.10,
              xanchor: 'center',
              yanchor: 'bottom',
              text: ` Estacion: ${allData.network}.${allData.station}.${allData.location}.${allData.channel}`,
              showarrow: false,
              font: {
                size: 14,
                color: 'rgb(150,150,150)'
              }
            }
          ],
          xaxis: {
            title: 'Periodo [s]',
            type: 'log',
            range: [-2, 1],
            tickvals: [0.01, 0.1, 1, 10],
            ticktext: ['0.01', '0.1', '1', '10'],
            showline: true,
           
          },
          yaxis: {
            title: 'Aceleracion Espectral [cm/s2]',
            showline: true,
            
          },

        };

        this.config = {
          displaylogo: false,
          responsive: true,
          displayModeBar: true,
          modeBarButtonsToAdd: [
            {
              name: 'Descargar Datos',
              icon: Plotly.Icons.disk,
              direction: 'up',
              click: function (gd: any) {
                const dataX = value.periodo;
                const dataY = value.amplitud;

                let dataText = '';
                dataText += 'Periodo' + '     ' + 'Amplitud' + '\n'

                for (let i = 0; i < dataX.length; i++) {
                  dataText += dataX[i] + '     ' + dataY[i] + '\n';
                }

                const downloadLink = document.createElement('a');
                downloadLink.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(dataText);
                downloadLink.download = `DATA_ESPC__${net}.${sta}.${loc}.${cha}.txt`;

                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
              }
            }
          ],
          modeBarButtonsToRemove: ['pan2d', 'select2d', 'lasso2d', 'hoverClosestCartesian', 'hoverCompareCartesian', 'toggleSpikelines']
        }

      },
      error: err => {
        this.loadingSpinnerGraph = false
        this.loadedPlot = true
      },
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
