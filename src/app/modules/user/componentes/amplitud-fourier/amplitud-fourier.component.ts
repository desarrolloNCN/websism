import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VisorGraphComponent } from '../../pages/visor-graph/visor-graph.component';
import { ObspyAPIService } from 'src/app/service/obspy-api.service';
import { Icons } from 'plotly.js-dist-min';

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

  dateConverter(date: string) {

    const fechaHora = new Date(date);

    const año = fechaHora.getFullYear();
    const mes = ("0" + (fechaHora.getMonth() + 1)).slice(-2);
    const dia = ("0" + fechaHora.getDate()).slice(-2);
    const horas = ("0" + fechaHora.getHours()).slice(-2);
    const minutos = ("0" + fechaHora.getMinutes()).slice(-2);
    const segundos = ("0" + fechaHora.getSeconds()).slice(-2);

    const formatoFechaHora = `${año}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;

    return formatoFechaHora
  }

  async loadGraph() {

    let url = this.dataFourier.url
    let sta = this.dataFourier.station
    let cha = this.dataFourier.channel

    let allData = this.dataFourier.allData

    let net = this.dataFourier.allData.network
    let loc = this.dataFourier.allData.location

    const st = new Date(this.dataFourier.allData.starttime).getTime()
    const et = new Date(this.dataFourier.allData.endtime).getTime()

    const diff = et - st;
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    const ms = diff % 1000;

    let fechaIn = this.dateConverter(this.dataFourier.allData.starttime)
    let fechaFn = this.dateConverter(this.dataFourier.allData.endtime)


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

        const [rangoNumeros, rangoStrings] = this.encontrarRango(value.amplitud);

        console.log(rangoNumeros, rangoStrings);
        

        this.layout = {
          title: {
            text: `Amplitud de Fourier [cm/s]`,
          },
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
          images: [{
            name: 'NCN Nuevo Control',
            source: 'https://media.licdn.com/dms/image/D4D0BAQEs4MhVJbaCAg/company-logo_200_200/0/1691423656655/ncnpe_logo?e=2147483647&v=beta&t=Js1B5sb_F6j2rob-7jZNwPgWywCIYCfcbQ9pmImSeU0',
            opacity: 0.1,
            layer: "below"
          }],
          xaxis: {
            title: 'Periodo [s]',
            type: 'log',
            range: [-2, 1],
            tickvals: [0.01, 0.1, 1, 10],
            ticktext: ['0.01', '0.1', '1', '10'],
            showline: true,
            linecolor: '#7a7a7a',
            linewidth: 0.5
          },
          yaxis: {
            title: 'Amplitud [cm/s]',
            type: 'log',
            tickvals: rangoNumeros,
            ticktext: rangoStrings,
            exponentformat: 'power',
            showline: true,
            linecolor: '#7a7a7a',
            linewidth: 0.5
          },

        };

        this.config = {
          displaylogo: false,
          responsive: true,
          displayModeBar: true,
          modeBarButtonsToAdd: [
            {
              name: 'Descargar Datos',
              icon: Icons.disk,
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
                downloadLink.download = `DATA_FOURIER_${net}.${sta}.${loc}.${cha}.txt`;
  
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
              }
            }
          ],
          modeBarButtonsToRemove: ['pan2d', 'select2d', 'lasso2d', 'hoverClosestCartesian', 'hoverCompareCartesian', 'toggleSpikelines']
        }

      },
      error: err => { },
      complete: () => {
        this.loadingSpinnerGraph = false
        this.loadedPlot = true
      }
    })
  }

  encontrarRango(array: number[]): [number[], string[]] {
    const minValue = Math.min(...array);
    const maxValue = Math.max(...array);

    const minExp = Math.floor(Math.log10(Math.abs(minValue)));
    const maxExp = Math.floor(Math.log10(Math.abs(maxValue)));

    const rangeNumbers: number[] = [];
    const rangeStrings: string[] = [];

    for (let i = minExp; i <= maxExp; i++) {
      let num = Math.pow(10, i);
      num = parseFloat(num.toFixed(10))
      rangeNumbers.push(num);
      rangeStrings.push(num.toString());
    }

    return [rangeNumbers, rangeStrings];
  }

  Close() {
    let respData = {
      "url": '',
      "unit": ''
    }
    this.matDialogRef.close(respData)
  }

}
