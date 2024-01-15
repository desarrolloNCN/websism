import { trigger, transition, style, animate, state } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { EChartsOption } from 'echarts';
import { ObspyAPIService } from 'src/app/service/obspy-api.service';

export interface StationInfo {
  network?: string,
  station?: string,
  location?: string,
  channel?: string,
  sampling_rate?: string,
  start_time?: string,
  end_time?: string,
  delta?: string
  npts?: string
  calib?: string
}

@Component({
  selector: 'app-visor-graph',
  animations: [
    trigger(
      'enterAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('300ms', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)', opacity: 1 }),
        animate('300ms', style({ transform: 'translateX(-100%)', opacity: 0 }))
      ])
    ]),
    trigger(
      'enterAnimation2', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('300ms', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0)', opacity: 1 }),
        animate('300ms', style({ transform: 'translateY(-100%)', opacity: 0 }))
      ])
    ]),
    trigger(
      'enterAnimation3', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)', opacity: 1 }),
        animate('300ms', style({ transform: 'translateX(100%)', opacity: 0 }))
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
  FilterForm: FormGroup | any
  TrimForm: FormGroup | any

  enproges = false

  arch: File[] | any = ''

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

  toogleTrim = false
  toogleFilter = false

  selectedStationInfo: StationInfo = {}
  baseLineOptions = ['constant', 'linear', 'demean', 'simple']



  constructor(
    private obsApi: ObspyAPIService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    localStorage.clear()
    this.controlForm = new FormGroup({
      url: new FormControl(''),

    })

    this.FilterForm = new FormGroup({
      type: new FormControl('', [Validators.required]),
      freqmin: new FormControl('', [Validators.required]),
      freqmax: new FormControl('', [Validators.required]),
      order: new FormControl('',)
    })

    this.TrimForm = new FormGroup({
      type: new FormControl(''),

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
            text: `Aceleracion - ${e.network}.${e.station}.${e.channel}`,
            subtext: `${e.starttime} | ${e.endtime}`,
          },
          tooltip: {
            trigger: 'axis',
          },
          toolbox: {
            show: true,
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              dataView: { readOnly: true },
              restore: {},
              saveAsImage: {}
            }
          },
          grid: {
            top: 80,
          },
          xAxis: {
            data: value[0].tiempo_a,
            name: "Tiempo [s]",
            silent: false,
            splitLine: {
              show: false,
            },
            axisLabel: {
              hideOverlap: true
            }
          },
          yAxis: {
            name: "Aceleracion (cm/s^2)",
            nameRotate: 90,
            nameLocation: 'middle',
            nameGap: 40
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
              name: 'Aceleracion (cm/s^2)',
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
            text: `Velocidad - ${e.network}.${e.station}.${e.channel}`,
            subtext: `${e.starttime} | ${e.endtime}`,
          },
          tooltip: {
            trigger: 'axis',
          },
          toolbox: {
            show: true,
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              dataView: { readOnly: true },
              restore: {},
              saveAsImage: {}
            }
          },
          grid: {
            top: 80,
          },
          xAxis: {
            data: value[0].tiempo_a,
            silent: false,
            name: "Tiempo [s]",
            splitLine: {
              show: false,
            },
            axisLabel: {
              hideOverlap: true
            }
          },
          yAxis: {
            name: "Velocidad (cm/s)",
            nameRotate: 90,
            nameLocation: 'middle',
            nameGap: 40
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
            text: `Desplazamiento - ${e.network}.${e.station}.${e.channel}`,
            subtext: `${e.starttime} | ${e.endtime}`,
          },
          tooltip: {
            trigger: 'axis',
          },
          toolbox: {
            show: true,
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              dataView: { readOnly: true },
              restore: {},
              saveAsImage: {}
            }
          },
          grid: {
            top: 80,
          },
          xAxis: {
            data: value[0].tiempo_a,
            silent: false,
            name: "Tiempo [s]",
            splitLine: {
              show: false,
            },
            axisLabel: {
              hideOverlap: true
            }
          },
          yAxis: {
            name: "Desplazamiento (cm) ",
            nameRotate: 90,
            nameLocation: 'middle',
            nameGap: 40
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

  baseLineCorrecion(base: string) {

    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 3 * 1000;
    snackBar.panelClass = ['snackBar-validator'];

    // if (Object.keys(this.selectedStationInfo).length === 0) {
    //   this.snackBar.open('Debe elegir una Estacion', 'cerrar', snackBar)
    //   return
    // }
    // let e = this.selectedStationInfo

    localStorage.setItem('base', base)

    this.loadingSpinnerGraph = true
    this.ToggleGraph = false

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
    // if(!net || !sta || !cha || !dataToUse){
    //   this.snackBar.open('No hay Datos para Renderizar', 'cerrar', snackBar)
    //   this.loadingSpinnerGraph = false
    //   return
    // }

    this.obsApi.getTraceDataBaseLine(dataToUse, sta, cha, base).subscribe({
      next: value => {

        this.ToggleGraph = false
        this.plotedimages = value

        this.accel = {
          title: {
            text: `Aceleracion - - ${net}.${sta}.${cha}`,
          },
          tooltip: {
            trigger: 'axis',
          },
          toolbox: {
            show: true,
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              dataView: { readOnly: true },
              restore: {},
              saveAsImage: {}
            }
          },
          grid: {
            top: 80,
          },
          xAxis: {
            data: value[0].tiempo_a,
            name: "Tiempo [s]",
            silent: false,
            splitLine: {
              show: false,
            },
            axisLabel: {
              hideOverlap: true
            }
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
              name: 'Aceleracion (cm/s^2)',
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
            text: `Velocidad - - ${net}.${sta}.${cha}`,
           
          },
          tooltip: {
            trigger: 'axis',
          },
          toolbox: {
            show: true,
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              dataView: { readOnly: true },
              restore: {},
              saveAsImage: {}
            }
          },
          grid: {
            top: 80,
          },
          xAxis: {
            data: value[0].tiempo_a,
            name: "Tiempo [s]",
            silent: false,
            splitLine: {
              show: false,
            },
            axisLabel: {
              hideOverlap: true
            }
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
              name: 'Aceleracion (cm/s)',
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
            axisLabel: {
              hideOverlap: true
            }
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
              name: 'Aceleracion (cm)',
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
      error: err => {
        this.snackBar.open('No hay Datos para Renderizar', 'cerrar', snackBar)
        this.loadingSpinnerGraph = false
        console.error('REQUEST API ERROR: ' + err.message)
      },
      complete: () => {

        this.loadingSpinnerGraph = false
        this.ToggleGraph = true
      }
    })
  }

  addFilter() {

    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 3 * 1000;
    snackBar.panelClass = ['snackBar-validator'];

    let net = localStorage.getItem('net')!
    let sta = localStorage.getItem('sta')!
    let cha = localStorage.getItem('cha')!
    let base = localStorage.getItem('base')!

    let type = this.FilterForm.get('type').value
    let fmin = this.FilterForm.get('freqmin').value
    let fmax = this.FilterForm.get('freqmax').value
    let corn = this.FilterForm.get('order').value

    var dataString: string = localStorage.getItem('urlSearched')!
    var dataFile: string = localStorage.getItem('urlFileUpload')!

    let dataToUse: string = dataFile !== "null" ? dataFile : dataString !== "null" ? dataString : "";

    if (this.FilterForm.invalid || !dataToUse) {
      this.snackBar.open('No hay Datos para Renderizar', 'cerrar', snackBar)
      return
    }

    this.loadingSpinnerGraph = true
    this.ToggleGraph = false

    this.accel = {}
    this.vel = {}
    this.dsp = {}

    this.obsApi.getTraceDataFilter(dataToUse, sta, cha, base, type, fmin, fmax, corn).subscribe({
      next: value => {

        this.ToggleGraph = false
        this.plotedimages = value

        this.accel = {
          title: {
            text: `Aceleracion - ${net}.${sta}.${cha}`,
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          xAxis: {
            data: value[0].tiempo_a,
            axisTick: {
              alignWithLabel: true
            },
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
      error: err => {
        this.snackBar.open('No hay Datos para Renderizar', 'cerrar', snackBar)
        this.loadingSpinnerGraph = false
        console.error('REQUEST API ERROR: ' + err.message)
      },
      complete: () => {

        this.loadingSpinnerGraph = false
        this.ToggleGraph = true
      }
    })
  }

  filterData() {
    this.toogleFilter = !this.toogleFilter
  }

  trimData() {
    this.toogleTrim = !this.toogleTrim
  }

  deleteFile() {
    this.btnShow = false;
    this.btnCancel = true;
    this.fileInput.nativeElement.value = ''
    this.groupedData = {}
    this.arch = ''
    this.controlForm.get('url').enable()
    this.accel = {}
    this.vel = {}
    this.dsp = {}
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

  graphGenerator(e: StationInfo, value: any) {

    this.accel = {
      title: {
        text: `Aceleracion - ${e.network}.${e.station}.${e.channel}`,
        subtext: `${e.start_time} | ${e.end_time}`,
      },
      tooltip: {
        trigger: 'axis',
      },
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          dataView: { readOnly: true },
          restore: {},
          saveAsImage: {}
        }
      },
      grid: {
        top: 80,
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
        text: `Velocidad - ${e.network}.${e.station}.${e.channel}`,
        subtext: `${e.start_time} | ${e.end_time}`,
      },
      tooltip: {
        trigger: 'axis',
      },
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          dataView: { readOnly: true },
          restore: {},
          saveAsImage: {}
        }
      },
      grid: {
        top: 80,
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
        text: `Desplazamiento - ${e.network}.${e.station}.${e.channel}`,
        subtext: `${e.start_time} | ${e.end_time}`,
      },
      tooltip: {
        trigger: 'axis',
      },
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          dataView: { readOnly: true },
          restore: {},
          saveAsImage: {}
        }
      },
      grid: {
        top: 80,
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
  }

}
