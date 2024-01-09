import { trigger, transition, style, animate, state } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { EChartsOption } from 'echarts';
import { ObspyAPIService } from 'src/app/service/obspy-api.service';



@Component({
  selector: 'app-visor-graph',
  animations: [
    trigger(
      'enterAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('200ms', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)', opacity: 1 }),
        animate('200ms', style({ transform: 'translateX(-100%)', opacity: 0 }))
      ])
    ]),
  ],
  templateUrl: './visor-graph.component.html',
  styleUrls: ['./visor-graph.component.css'],

})
export class VisorGraphComponent implements OnInit {

  accel: EChartsOption | any;
  vel: EChartsOption | any;
  dsp: EChartsOption | any;

  controlForm: FormGroup | any

  enproges = false

  arch: File[] | any = ''

  respData: any = []
  stationInfo: any = {}

  loadingSpinner = false
  loadingSpinnerGraph = false
  ToggleGraph = false

  btnShow = false
  btnCancel = true

  hideStaPanel = true

  urlFile = ''
  idFile = ''
  stringdata = ''

  plotedimages: any = []

  constructor(
    private obsApi: ObspyAPIService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    localStorage.clear()
    this.controlForm = new FormGroup({
      url: new FormControl(''),

    })
  }

  onFileSelected(event: any) {
    let archivos = event.target.files;
    this.controlForm.get('url').setValue('')

    if (archivos && archivos.length > 0) {
      this.arch = archivos[0];
      this.btnShow = true;
      this.btnCancel = false;
      this.controlForm.get('url').disable()
    } else {
      console.log('No se seleccionó ningún archivo');
      this.btnShow = false;
      this.btnCancel = true;
      this.arch = null;
    }
  }

  @ViewChild('fileInput') fileInput!: ElementRef

  leerArchivo() {

    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 3 * 1000;
    snackBar.panelClass = ['snackBar-validator'];

    let textoValue = this.controlForm.get('url').value;
    let archivoValue = this.arch;

    this.groupedData = {}

    let valorNoVacio: string | File | undefined;

    this.loadingSpinner = true

    if (archivoValue instanceof File || typeof textoValue === 'string' && textoValue.trim() !== '') {

      valorNoVacio = archivoValue || textoValue

      this.obsApi.uploadFile(valorNoVacio).subscribe({
        next: value => {
          this.idFile = value.id
          this.urlFile = value.file
          this.stringdata = value.string_data
          localStorage.setItem('idSesion', value.id)
          localStorage.setItem('urlFileUpload', value.file)
          localStorage.setItem('urlSearched', value.string_data)
        },
        error: err => console.error('REQUEST API ERROR: ' + err.message),
        complete: () => {

          if (this.urlFile == null) {
            this.obsApi.getData(this.stringdata).subscribe({
              next: value => {
                this.groupedData = this.groupByNetworkAndStation(value.data)
              },
              error: err => console.error('REQUEST API ERROR: ' + err.message),
              complete: () => {
                this.loadingSpinner = false
              }
            })

          } else if (this.stringdata == null) {
            this.obsApi.getData(this.urlFile).subscribe({
              next: value => {
                this.groupedData = this.groupByNetworkAndStation(value.data)
              },
              error: err => console.error('REQUEST API ERROR: ' + err.message),
              complete: () => {
                this.loadingSpinner = false
              }
            })
          } else {
            this.snackBar.open('No se puede leer Datos', 'cerrar', snackBar)
          }

        }
      })
    } else {
      this.snackBar.open('No se encontro ARCHIVO o URL', 'cerrar', snackBar)
      this.loadingSpinner = false
    }
  }

  leer(e: any) {

    localStorage.setItem('net', e.network) 
    localStorage.setItem('sta', e.station) 
    localStorage.setItem('cha', e.channel) 

    this.loadingSpinnerGraph = true
    this.ToggleGraph = false

    this.stationInfo = e

    this.accel = {}
    this.vel = {}
    this.dsp = {}

    var dataString: string = localStorage.getItem('urlSearched')!
    var dataFile: string = localStorage.getItem('urlFileUpload')!

    let dataToUse: string = dataFile !== "null" ? dataFile : dataString !== "null" ? dataString : "";

    this.obsApi.getTraceData(dataToUse, e.station, e.channel).subscribe({
      next: value => {

        this.ToggleGraph = false
        this.plotedimages = value

        this.accel = {
          title: {
            text: `Aceleracion - ${e.network}.${e.station}.${e.channel} - ${e.starttime} | ${e.endtime} `,
          },
          tooltip: {
            trigger: 'axis',
          },
          xAxis: {
            data: value[0].tiempo_a,
            name: "Tiempo [s]",
            silent: false,
            splitLine: {
              show: false,
            },
          },
          yAxis: {
            name: "Aceleracion"
          },
          dataZoom: [
            {
              type: 'inside',
              start: 0,
              end: 100
            },
            {
              start: 0,
              end: 100,
              handleIcon: 'M10 0 L5 10 L0 0 L5 0 Z',
              handleSize: '100%',
              handleStyle: {
                color: '#ddd'
              }
            }
          ],
          series: [
            {
              name: 'Aceleracion (mk/s/s)',
              type: 'line',
              showSymbol: false,
              data: value[0].traces_a,
              animationDelay: (idx: number) => idx * 10,
            },
          ],
          animationEasing: 'elasticOut',
          animationDelayUpdate: (idx: number) => idx * 5,
        };

        this.vel = {
          title: {
            text: `Velocidad - ${e.network}.${e.station}.${e.channel} - ${e.starttime} | ${e.endtime} `,
          },
          tooltip: {
            trigger: 'axis',
          },
          xAxis: {
            data: value[0].tiempo_a,
            silent: false,
            name: "Tiempo [s]",
            splitLine: {
              show: false,
            },
          },
          yAxis: {
            name: "Velocidad"
          },
          dataZoom: [
            {
              type: 'inside',
              start: 0,
              end: 100
            },
            {
              start: 0,
              end: 100,
              handleIcon: 'M10 0 L5 10 L0 0 L5 0 Z',
              handleSize: '100%',
              handleStyle: {
                color: '#ddd'
              }
            }
          ],
          series: [
            {
              name: 'Aceleracion (mk/s/s)',
              type: 'line',
              showSymbol: false,
              data: value[0].traces_v,
              animationDelay: (idx: number) => idx * 10,
            },
          ],
          animationEasing: 'elasticOut',
          animationDelayUpdate: (idx: number) => idx * 5,
        };

        this.dsp = {
          title: {
            text: `Desplazamiento - ${e.network}.${e.station}.${e.channel} - ${e.starttime} | ${e.endtime} `,
          },
          tooltip: {
            trigger: 'axis',
          },
          xAxis: {
            data: value[0].tiempo_a,
            silent: false,
            name: "Tiempo [s]",
            splitLine: {
              show: false,
            },
          },
          yAxis: {
            name: "Desplazamiento"
          },
          dataZoom: [
            {
              type: 'inside',
              start: 0,
              end: 100
            },
            {
              start: 0,
              end: 100,
              handleIcon: 'M10 0 L5 10 L0 0 L5 0 Z',
              handleSize: '100%',
              handleStyle: {
                color: '#ddd'
              }
            }
          ],
          series: [
            {
              name: 'Aceleracion (mk/s/s)',
              type: 'line',
              showSymbol: false,
              data: value[0].traces_d,
              animationDelay: (idx: number) => idx * 10,
            },
          ],
          animationEasing: 'elasticOut',
          animationDelayUpdate: (idx: number) => idx * 5,
        };

      },
      error: err => console.error('REQUEST API ERROR: ' + err.message),
      complete: () => {

        this.loadingSpinnerGraph = false
        this.ToggleGraph = true
      }
    })
  }

  baseLineCorrecion(base : string){
    this.loadingSpinnerGraph = true
    this.ToggleGraph = false

    console.log(base);

    //this.stationInfo = e
    let net = localStorage.getItem('net')!
    let sta = localStorage.getItem('sta')!
    let cha = localStorage.getItem('cha')!

    this.accel = {}
    this.vel = {}
    this.dsp = {}

    var dataString: string = localStorage.getItem('urlSearched')!
    var dataFile: string = localStorage.getItem('urlFileUpload')!

    let dataToUse: string = dataFile !== "null" ? dataFile : dataString !== "null" ? dataString : "";

    this.obsApi.getTraceDataBaseLine(dataToUse, sta, cha, base).subscribe({
      next: value => {

        this.ToggleGraph = false
        this.plotedimages = value

        this.accel = {
          title: {
            text: `Aceleracion - ${net}.${sta}.${cha}`,
          },
          tooltip: {
            trigger: 'axis',
          },
          xAxis: {
            data: value[0].tiempo_a,
            name: "Tiempo [s]",
            silent: false,
            splitLine: {
              show: false,
            },
          },
          yAxis: {
            name: "Aceleracion"
          },
          dataZoom: [
            {
              type: 'inside',
              start: 0,
              end: 100
            },
            {
              start: 0,
              end: 100,
              handleIcon: 'M10 0 L5 10 L0 0 L5 0 Z',
              handleSize: '100%',
              handleStyle: {
                color: '#ddd'
              }
            }
          ],
          series: [
            {
              name: 'Aceleracion (mk/s/s)',
              type: 'line',
              showSymbol: false,
              data: value[0].traces_a,
              animationDelay: (idx: number) => idx * 10,
            },
          ],
          animationEasing: 'elasticOut',
          animationDelayUpdate: (idx: number) => idx * 5,
        };

        this.vel = {
          title: {
            text: `Velocidad - ${net}.${sta}.${cha} `,
          },
          tooltip: {
            trigger: 'axis',
          },
          xAxis: {
            data: value[0].tiempo_a,
            silent: false,
            name: "Tiempo [s]",
            splitLine: {
              show: false,
            },
          },
          yAxis: {
            name: "Velocidad"
          },
          dataZoom: [
            {
              type: 'inside',
              start: 0,
              end: 100
            },
            {
              start: 0,
              end: 100,
              handleIcon: 'M10 0 L5 10 L0 0 L5 0 Z',
              handleSize: '100%',
              handleStyle: {
                color: '#ddd'
              }
            }
          ],
          series: [
            {
              name: 'Aceleracion (mk/s/s)',
              type: 'line',
              showSymbol: false,
              data: value[0].traces_v,
              animationDelay: (idx: number) => idx * 10,
            },
          ],
          animationEasing: 'elasticOut',
          animationDelayUpdate: (idx: number) => idx * 5,
        };

        this.dsp = {
          title: {
            text: `Desplazamiento - ${net}.${sta}.${cha} `,
          },
          tooltip: {
            trigger: 'axis',
          },
          xAxis: {
            data: value[0].tiempo_a,
            silent: false,
            name: "Tiempo [s]",
            splitLine: {
              show: false,
            },
          },
          yAxis: {
            name: "Desplazamiento"
          },
          dataZoom: [
            {
              type: 'inside',
              start: 0,
              end: 100
            },
            {
              start: 0,
              end: 100,
              handleIcon: 'M10 0 L5 10 L0 0 L5 0 Z',
              handleSize: '100%',
              handleStyle: {
                color: '#ddd'
              }
            }
          ],
          series: [
            {
              name: 'Aceleracion (mk/s/s)',
              type: 'line',
              showSymbol: false,
              data: value[0].traces_d,
              animationDelay: (idx: number) => idx * 10,
            },
          ],
          animationEasing: 'elasticOut',
          animationDelayUpdate: (idx: number) => idx * 5,
        };

      },
      error: err => console.error('REQUEST API ERROR: ' + err.message),
      complete: () => {

        this.loadingSpinnerGraph = false
        this.ToggleGraph = true
      }
    })
  }

  deleteFile() {
    this.btnShow = false;
    this.btnCancel = true;
    this.fileInput.nativeElement.value = ''
    this.groupedData = {}
    this.arch = ''
    this.controlForm.get('url').enable()
  }

  togglePanel() {
    this.hideStaPanel = !this.hideStaPanel
  }

  groupedData: { [key: string]: any[] } = {};
  selectedGroup: string | null = null;

  groupByNetworkAndStation(data: any[]): { [key: string]: any[] } {
    const grouped: { [key: string]: any[] } = {};

    data.forEach(item => {
      const key = `${item.network}.${item.station}`;

      if (!grouped[key]) {
        grouped[key] = [];
      }

      grouped[key].push(item);
    });

    return grouped;
  }

  selectGroup(groupKey: string): void {
    this.selectedGroup = groupKey;
  }

  getGroupValues(group: any): any[] {
    return Object.values(group.value);
  }

}
