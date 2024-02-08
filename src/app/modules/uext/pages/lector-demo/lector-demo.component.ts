import { trigger, transition, style, animate } from '@angular/animations';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatTab, MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { EChartsOption } from 'echarts';
import { ObspyAPIService } from 'src/app/service/obspy-api.service';

@Component({
  selector: 'app-lector-demo',
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
  templateUrl: './lector-demo.component.html',
  styleUrls: ['./lector-demo.component.css']
})
export class LectorDemoComponent implements OnInit {


  accel: EChartsOption | any;
  vel: EChartsOption | any;
  dsp: EChartsOption | any;

  controlForm: FormGroup | any
  FilterForm: FormGroup | any
  TrimForm: FormGroup | any

  enproges = false

  arch: File[] | any = ''
  buscarTexto: string = '';

  stationInfo: any = {}

  loadingSpinner = false
  loadingSpinnerStaInfo = false
  loadingSpinnerGraph = false
  loadingSpinnerData = false
  isLoading = false

  ToggleGraph = false
  toggleTabs = false

  btnShow = false
  btnCancel = true

  hideStaPanel = true
  showResponsivebar = false

  urlFile = ''
  idFile = ''
  stringdata = ''

  plotedimages: any = []

  toogleTrim = false
  toogleFilter = false

  baseLineOptions = ['constant', 'linear', 'demean', 'simple']
  unitConvertOptions = ['cm/s2 [GaL]', 'm/s2', 'G', 'unk']

  tabs: any = []
  matTabs: MatTab[] = []
  tabIndex = 0

  actApli: any = []

  formGroups: FormGroup[] = [];

  constructor(
    private obsApi: ObspyAPIService,
    private snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef,
  ) {

    this.FilterForm = new FormGroup({
      type: new FormControl('', [Validators.required]),
      freqmin: new FormControl('', [Validators.required]),
      freqmax: new FormControl('', [Validators.required]),
      order: new FormControl('',),
      zero: new FormControl(false)
    });

    this.TrimForm = new FormGroup({
      t_min: new FormControl('', [Validators.required]),
      t_max: new FormControl('', [Validators.required])
    });

  }

  ngOnInit(): void {
    localStorage.clear()

    this.controlForm = new FormGroup({
      url: new FormControl(''),

    })
  }

  // ! Manipulacion de Archivos 

  onFileSelected(event: any) {
    let archivos = event.target.files;
    this.controlForm.get('url').setValue('')

    if (archivos && archivos.length > 0) {
      this.arch = archivos[0];
      this.btnShow = true;
      this.btnCancel = false;
      this.controlForm.get('url').disable()
    } else {
      this.btnShow = false;
      this.btnCancel = true;
      this.arch = null;
    }
  }

  @ViewChild('fileInput') fileInput!: ElementRef

  leerArchivo() {

    this.clearData()

    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 5 * 1000;
    snackBar.panelClass = ['snackBar-validator'];

    let textoValue = this.controlForm.get('url').value;
    let archivoValue = this.arch;

    let valorNoVacio: string | File | undefined;

    this.loadingSpinner = true
    this.loadingSpinnerStaInfo = true

    if (archivoValue instanceof File || typeof textoValue === 'string' && textoValue.trim() !== '') {

      valorNoVacio = archivoValue || textoValue

      this.obsApi.uploadFile(valorNoVacio).subscribe({
        next: value => {
          this.idFile = value.id
          this.urlFile = value.file
          this.stringdata = value.string_data

          localStorage.setItem('urlFileUpload', value.file)
          localStorage.setItem('urlSearched', value.string_data)

        },
        error: err => {
          this.loadingSpinner = false
          this.loadingSpinnerStaInfo = false
          // console.error('REQUEST API ERROR: ' + err.message)
          this.snackBar.open('⚠️ Fuera de Linea', 'cerrar', snackBar)
        },
        complete: () => {

          if (this.urlFile == null) {
            this.obsApi.getData(this.stringdata).subscribe({
              next: value => {
                this.groupedData = this.groupByNetworkAndStation(value.data, value.inv)
              },
              error: err => {
                this.snackBar.open('Formato no Soportado', 'cerrar', snackBar)
                this.loadingSpinner = false
                this.loadingSpinnerStaInfo = false
              },
              complete: () => {
                this.loadingSpinner = false
                this.loadingSpinnerStaInfo = false
              }
            })

          } else if (this.stringdata == null) {
            this.obsApi.getData(this.urlFile).subscribe({
              next: value => {

                this.toggleTabs = true
                this.groupedData = this.groupByNetworkAndStation(value.data, value.inv)
              },
              error: err => {
                this.snackBar.open('Formato no Soportado', 'cerrar', snackBar)
                this.loadingSpinner = false
                this.loadingSpinnerStaInfo = false
              },
              complete: () => {
                this.loadingSpinner = false
                this.loadingSpinnerStaInfo = false
              }
            })
          } else {
            this.snackBar.open('No se puede leer Datos', 'cerrar', snackBar)
            this.loadingSpinner = false
            this.loadingSpinnerStaInfo = false
          }
        }
      })

    } else {
      this.snackBar.open('No se encontro ARCHIVO o URL', 'cerrar', snackBar)
      this.loadingSpinner = false
      this.loadingSpinnerStaInfo = false
    }
  }

  leer(e: any) {

    for (const elem of this.tabs) {
      if (elem.label == `${e.station}.${e.channel}`) {
        alert('Ya hay una pestaña con esa estacion')
        return
      }
    }

    this.loadingSpinnerGraph = true
    this.ToggleGraph = false
    this.toggleTabs = false

    this.stationInfo = e

    var dataString: string = localStorage.getItem('urlSearched')!
    var dataFile: string = localStorage.getItem('urlFileUpload')!

    let dataToUse: string = dataFile !== "null" ? dataFile : dataString !== "null" ? dataString : "";

    this.obsApi.getTraceData(dataToUse, e.station, e.channel).subscribe({
      next: value => { this.createTab(e, value) },
      error: err => console.error('REQUEST API ERROR: ' + err.message),
      complete: () => {
        this.loadingSpinnerGraph = false
        this.ToggleGraph = true
      }
    })
  }

  // ! Creacion de Tabs

  createTab(e: any, value: any): void {
    this.ToggleGraph = false;

    const graph = this.graphGenerator(e, value, '(RAWDATA)');

    this.toggleTabs = true;

    const FilterForm = new FormGroup({
      type: new FormControl('', [Validators.required]),
      freqmin: new FormControl('', [Validators.required]),
      freqmax: new FormControl('', [Validators.required]),
      order: new FormControl('', [Validators.required]),
      zero: new FormControl(false)
    })

    const TrimForm = new FormGroup({
      t_min: new FormControl('', [Validators.required]),
      t_max: new FormControl('', [Validators.required]),
    })

    this.tabs.push({
      label: `${e.station}.${e.channel}`,
      dataEst: e,
      sttime: e.starttime,
      entime: e.endtime,
      FilterForm,
      TrimForm,
      graph,
    });

    this.ToggleGraph = true;

  }

  // ! Herramientas para Ploteo

  baseLine(menuIndex: number, index: number) {

    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 3 * 1000;
    snackBar.panelClass = ['snackBar-validator'];

    if (Object.keys(this.stationInfo).length === 0) {
      this.snackBar.open('Debe elegir una Estacion', 'cerrar', snackBar)
      return
    }

    let base = this.baseLineOptions[menuIndex]
    let unit = this.tabs[index].unit || ''

    var dataString: string = localStorage.getItem('urlSearched')!
    var dataFile: string = localStorage.getItem('urlFileUpload')!

    let dataToUse: string = dataFile !== "null" ? dataFile : dataString !== "null" ? dataString : "";

    let sta = this.tabs[index].dataEst.station
    let cha = this.tabs[index].dataEst.channel

    let type = this.tabs[index].FilterForm.get('type').value
    let fmin = this.tabs[index].FilterForm.get('freqmin').value
    let fmax = this.tabs[index].FilterForm.get('freqmax').value
    let corn = this.tabs[index].FilterForm.get('order').value
    let zero = this.tabs[index].FilterForm.get('zero').value

    const t_min = parseFloat(this.tabs[index].TrimForm.get('t_min').value);
    const t_max = parseFloat(this.tabs[index].TrimForm.get('t_max').value);

    let utc_min: any
    let utc_max: any

    let min = ''
    let max = ''

    if (isNaN(t_min) && isNaN(t_max)) {
      min = ''
      max = ''
    } else {
      utc_min = new Date(this.tabs[index].sttime);
      utc_max = new Date(this.tabs[index].sttime);

      utc_min.setUTCSeconds(utc_min.getUTCSeconds() + t_min);
      utc_max.setUTCSeconds(utc_max.getUTCSeconds() + t_max);

      min = utc_min.toISOString()
      max = utc_max.toISOString()
    }

    this.ToggleGraph = false
    this.isLoading = true

    this.obsApi.getTraceDataBaseLine(dataToUse, sta, cha, base, type, fmin, fmax, corn, zero, min, max, unit).subscribe({
      next: value => {

        this.ToggleGraph = false


        const indx = this.tabs.findIndex((tab: { label: string; }) => tab.label === `${sta}.${cha}`);

        if (indx !== -1) {

          const graph = this.graphGenerator(this.stationInfo, value, '(MODIFIED)')

          this.tabs[indx].graph = graph;
          this.tabs[indx].base = base

          this.cdRef.detectChanges();
        }


      },
      error: err => {
        this.snackBar.open('No hay Datos para Renderizar', 'cerrar', snackBar)
        this.loadingSpinnerGraph = false
        console.error('REQUEST API ERROR: ' + err.message)
      },
      complete: () => {
        this.actApli.push(`Linea Base: ${base} a ${sta}.${cha}`)
        this.loadingSpinnerData = false

        this.ToggleGraph = true
        this.isLoading = false
      }
    })
  }

  filter(index: number) {

    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 3 * 1000;
    snackBar.panelClass = ['snackBar-validator'];

    var dataString: string = localStorage.getItem('urlSearched')!
    var dataFile: string = localStorage.getItem('urlFileUpload')!

    let dataToUse: string = dataFile !== "null" ? dataFile : dataString !== "null" ? dataString : "";

    let base = this.tabs[index].base || ''
    let unit = this.tabs[index].unit || ''

    let sta = this.tabs[index].dataEst.station
    let cha = this.tabs[index].dataEst.channel

    let type = this.tabs[index].FilterForm.get('type').value
    let fmin = this.tabs[index].FilterForm.get('freqmin').value
    let fmax = this.tabs[index].FilterForm.get('freqmax').value
    let corn = this.tabs[index].FilterForm.get('order').value
    let zero = this.tabs[index].FilterForm.get('zero').value

    if (this.tabs[index].FilterForm.invalid || !dataToUse) {
      this.snackBar.open('No hay Datos para Renderizar', 'cerrar', snackBar)
      return
    }

    const t_min = parseFloat(this.tabs[index].TrimForm.get('t_min').value);
    const t_max = parseFloat(this.tabs[index].TrimForm.get('t_max').value);

    let utc_min: any
    let utc_max: any

    let min = ''
    let max = ''

    if (isNaN(t_min) && isNaN(t_max)) {
      min = ''
      max = ''
    } else {
      utc_min = new Date(this.tabs[index].sttime);
      utc_max = new Date(this.tabs[index].sttime);

      utc_min.setUTCSeconds(utc_min.getUTCSeconds() + t_min);
      utc_max.setUTCSeconds(utc_max.getUTCSeconds() + t_max);

      min = utc_min.toISOString()
      max = utc_max.toISOString()
    }

    this.isLoading = true

    this.obsApi.getTraceDataFilter(dataToUse, sta, cha, base, type, fmin, fmax, corn, zero, min, max, unit).subscribe({
      next: value => {

        this.ToggleGraph = false
        this.loadingSpinnerData = true

        const indx = this.tabs.findIndex((tab: { label: string; }) => tab.label === `${sta}.${cha}`);

        if (indx !== -1) {

          const graph = this.graphGenerator(this.stationInfo, value, '(MODIFIED)')

          this.tabs[indx].graph = graph;

          // Manualmente activar la detección de cambios para la pestaña actualizada
          this.cdRef.detectChanges();
        }

      },
      error: err => {
        this.snackBar.open('No hay Datos para Renderizar', 'cerrar', snackBar)
        this.loadingSpinnerGraph = false
        console.error('REQUEST API ERROR: ' + err.message)
      },
      complete: () => {
        this.actApli.push(`Filtro: ${type} a ${sta}.${cha}`)

        this.loadingSpinnerData = false
        this.ToggleGraph = true

        this.isLoading = false
      }
    })
  }

  trim(index: number) {

    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 3 * 1000;
    snackBar.panelClass = ['snackBar-validator'];

    var dataString: string = localStorage.getItem('urlSearched')!
    var dataFile: string = localStorage.getItem('urlFileUpload')!

    let dataToUse: string = dataFile !== "null" ? dataFile : dataString !== "null" ? dataString : "";

    let base = this.tabs[index].base || ''
    let unit = this.tabs[index].unit || ''

    let sta = this.tabs[index].dataEst.station
    let cha = this.tabs[index].dataEst.channel

    const t_min = parseFloat(this.tabs[index].TrimForm.get('t_min').value);
    const t_max = parseFloat(this.tabs[index].TrimForm.get('t_max').value);

    let type = this.tabs[index].FilterForm.get('type').value
    let fmin = this.tabs[index].FilterForm.get('freqmin').value
    let fmax = this.tabs[index].FilterForm.get('freqmax').value
    let corn = this.tabs[index].FilterForm.get('order').value
    let zero = this.tabs[index].FilterForm.get('zero').value

    if (this.tabs[index].TrimForm.invalid || !dataToUse) {
      this.snackBar.open('No hay Datos para Renderizar', 'cerrar', snackBar)
      return
    }

    if (t_max < t_min) {
      this.snackBar.open('Verificar los Tiempos de Inicio y Fin', 'cerrar', snackBar)
      return
    }

    let utc_min = new Date(this.tabs[index].sttime)
    let utc_max = new Date(this.tabs[index].sttime)

    utc_min.setUTCSeconds(utc_min.getUTCSeconds() + t_min)
    utc_max.setUTCSeconds(utc_max.getUTCSeconds() + t_max)

    let min = utc_min.toISOString()
    let max = utc_max.toISOString()

    this.ToggleGraph = false

    this.isLoading = true


    this.obsApi.getTraceDataTrim(dataToUse, sta, cha, base, type, fmin, fmax, corn,zero, min, max, unit).subscribe({
      next: value => {

        this.ToggleGraph = false
        this.loadingSpinnerData = true

        // const indx = this.tabs.findIndex((tab: { index: number; }) => tab.index === index)
        const indx = this.tabs.findIndex((tab: { label: string; }) => tab.label === `${sta}.${cha}`);

        if (indx !== -1) {

          const graph = this.graphGenerator(this.stationInfo, value, '(MODIFIED)')

          this.tabs[indx].graph = graph;

          this.cdRef.detectChanges();
        }

      },
      error: err => {
        this.snackBar.open('No hay Datos para Renderizar', 'cerrar', snackBar)
        this.loadingSpinnerGraph = false
        console.error('REQUEST API ERROR: ' + err.message)
      },
      complete: () => {
        this.actApli.push(`Trim: ${t_max - t_min}seg a ${sta}.${cha}`)

        this.loadingSpinnerData = false

        this.ToggleGraph = true

        this.isLoading = false
      }
    })
  }

  unitConverter(menuIndex: number, index: number) {

    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 3 * 1000;
    snackBar.panelClass = ['snackBar-validator'];

    if (Object.keys(this.stationInfo).length === 0) {
      this.snackBar.open('Debe elegir una Estacion', 'cerrar', snackBar)
      return
    }

    let base = this.tabs[index].base || ''
  
    const unitMap: { [key: string]: string } = {
      'cm/s2 [GaL]': 'gal',
      'm/s2': 'm',
      'G': 'g',
      'unk': ''
    };

    let unit = this.unitConvertOptions[menuIndex];
    unit = unitMap[unit] || '';

    var dataString: string = localStorage.getItem('urlSearched')!
    var dataFile: string = localStorage.getItem('urlFileUpload')!

    let dataToUse: string = dataFile !== "null" ? dataFile : dataString !== "null" ? dataString : "";

    let sta = this.tabs[index].dataEst.station
    let cha = this.tabs[index].dataEst.channel

    let type = this.tabs[index].FilterForm.get('type').value
    let fmin = this.tabs[index].FilterForm.get('freqmin').value
    let fmax = this.tabs[index].FilterForm.get('freqmax').value
    let corn = this.tabs[index].FilterForm.get('order').value
    let zero = this.tabs[index].FilterForm.get('zero').value

    const t_min = parseFloat(this.tabs[index].TrimForm.get('t_min').value);
    const t_max = parseFloat(this.tabs[index].TrimForm.get('t_max').value);

    let utc_min: any
    let utc_max: any

    let min = ''
    let max = ''

    if (isNaN(t_min) && isNaN(t_max)) {
      min = ''
      max = ''
    } else {
      utc_min = new Date(this.tabs[index].sttime);
      utc_max = new Date(this.tabs[index].sttime);

      utc_min.setUTCSeconds(utc_min.getUTCSeconds() + t_min);
      utc_max.setUTCSeconds(utc_max.getUTCSeconds() + t_max);

      min = utc_min.toISOString()
      max = utc_max.toISOString()
    }

    this.ToggleGraph = false
    this.isLoading = true

    this.obsApi.unitConvertion(dataToUse, sta, cha, base, type, fmin, fmax, corn, zero, min, max, unit).subscribe({
      next: value => {

        this.ToggleGraph = false


        const indx = this.tabs.findIndex((tab: { label: string; }) => tab.label === `${sta}.${cha}`);

        if (indx !== -1) {

          const graph = this.graphGenerator(this.stationInfo, value, '(MODIFIED)')

          this.tabs[indx].graph = graph;
          this.tabs[indx].unit = unit

          this.cdRef.detectChanges();
        }


      },
      error: err => {
        this.snackBar.open('No hay Datos para Renderizar', 'cerrar', snackBar)
        this.loadingSpinnerGraph = false
        console.error('REQUEST API ERROR: ' + err.message)
      },
      complete: () => {
        this.actApli.push(`Linea Base: ${base} a ${sta}.${cha}`)
        this.loadingSpinnerData = false

        this.ToggleGraph = true
        this.isLoading = false
      }
    })
  }


  // ! Generador de Graficos
  graphGenerator(e: any, value: any, dataformat: any) {

    const st = new Date(e.starttime).getTime()
    const et = new Date(e.endtime).getTime()


    const diff = et - st;
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    const ms = diff % 1000;

    const graphArr: any = []

    let und = e.und_calib

    und ? e.und_calib : 'unk'

    const dataZoomConfig = [
      {
        type: 'inside',
        start: 0,
        end: 100,
        zoomLock: true
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
    ]

    let peakA = value[0].peak_a || 0.00
    let peakV = value[0].peak_v || 0.00
    let peakD = value[0].peak_d || 0.00

    const accel = {
      animationDuration: 5000,
      title: {
        text: `${dataformat} - Aceleracion | ${e.network}.${e.station}.${e.location}.${e.channel}`,
        subtext: `Inicio: ${e.starttime} || Fin: ${e.endtime} || Duracion: ${h}hrs. ${m}min. ${s}seg. ${ms}ms.`,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      toolbox: {
        show: true,
        itemSize: 25,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          dataView: { readOnly: true },
          restore: {},
          saveAsImage: {},
          myDownloadButton: {
            show: true,
            title: 'Descargar Datos',
            icon: "path://M18.344,16.174l-7.98-12.856c-0.172-0.288-0.586-0.288-0.758,0L1.627,16.217c0.339-0.543-0.603,0.668,0.384,0.682h15.991C18.893,16.891,18.167,15.961,18.344,16.174 M2.789,16.008l7.196-11.6l7.224,11.6H2.789z M10.455,7.552v3.561c0,0.244-0.199,0.445-0.443,0.445s-0.443-0.201-0.443-0.445V7.552c0-0.245,0.199-0.445,0.443-0.445S10.455,7.307,10.455,7.552M10.012,12.439c-0.733,0-1.33,0.6-1.33,1.336s0.597,1.336,1.33,1.336c0.734,0,1.33-0.6,1.33-1.336S10.746,12.439,10.012,12.439M10.012,14.221c-0.244,0-0.443-0.199-0.443-0.445c0-0.244,0.199-0.445,0.443-0.445s0.443,0.201,0.443,0.445C10.455,14.021,10.256,14.221,10.012,14.221",
            onclick: function () {

              const dataX = value[0].tiempo_a;
              const dataY = value[0].traces_a;

              let dataText = '';

              for (let i = 0; i < dataX.length; i++) {
                dataText += dataX[i] + '     ' + dataY[i] + '\n';
              }

              const downloadLink = document.createElement('a');
              downloadLink.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(dataText);
              downloadLink.download = `DATA_ACELERACION_${e.network}.${e.station}.${e.location}.${e.channel}.txt`;

              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);
            }
          }
        }
      },
      grid: {
        top: 100,
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
        name: `Aceleracion`,
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100,
          zoomLock: true
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
          name: 'Aceleracion',
          type: 'line',
          showSymbol: false,
          data: value[0].traces_a,
          animationDelay: (idx: number) => idx * 10,
        },
      ],
      graphic: [
        {
          type: 'image',
          id: 'logo',
          left: 'center',
          top: 'center',
          z: -10,
          bounding: 'all',
          style: {
            image: 'assets/ncnLogoColor.png',
            width: 300,
            height: 300,
            opacity: 0.2
          }
        },
        {
          type: 'text',
          z: 100,
          right: 0,
          top: 50,
          style: {
            fill: '#333',
            width: 220,
            overflow: 'break',
            text: `PGA: ${parseFloat(peakA).toFixed(5)} [${value[0].trace_a_unit}]`,
            font: '14px Microsoft YaHei'
          }
        }
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx: number) => idx * 5,
    };

    const vel = {
      animationDuration: 5000,
      title: {
        text: `${dataformat} - Velocidad | ${e.network}.${e.station}.${e.location}.${e.channel}`,
        subtext: `Inicio: ${e.starttime} || Fin: ${e.endtime} || Duracion: ${h}hrs. ${m}min. ${s}seg. ${ms}ms.`,
      },
      tooltip: {
        trigger: 'axis',
      },
      toolbox: {
        show: true,
        itemSize: 25,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          dataView: { readOnly: true },
          restore: {},
          saveAsImage: {},
          myDownloadButton: {
            show: true,
            title: 'Descargar Datos',
            icon: "path://M18.344,16.174l-7.98-12.856c-0.172-0.288-0.586-0.288-0.758,0L1.627,16.217c0.339-0.543-0.603,0.668,0.384,0.682h15.991C18.893,16.891,18.167,15.961,18.344,16.174 M2.789,16.008l7.196-11.6l7.224,11.6H2.789z M10.455,7.552v3.561c0,0.244-0.199,0.445-0.443,0.445s-0.443-0.201-0.443-0.445V7.552c0-0.245,0.199-0.445,0.443-0.445S10.455,7.307,10.455,7.552M10.012,12.439c-0.733,0-1.33,0.6-1.33,1.336s0.597,1.336,1.33,1.336c0.734,0,1.33-0.6,1.33-1.336S10.746,12.439,10.012,12.439M10.012,14.221c-0.244,0-0.443-0.199-0.443-0.445c0-0.244,0.199-0.445,0.443-0.445s0.443,0.201,0.443,0.445C10.455,14.021,10.256,14.221,10.012,14.221",
            onclick: function () {

              const dataX = value[0].tiempo_a;
              const dataY = value[0].traces_v;

              let dataText = '';

              for (let i = 0; i < dataX.length; i++) {
                dataText += dataX[i] + '     ' + dataY[i] + '\n';
              }

              const downloadLink = document.createElement('a');
              downloadLink.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(dataText);
              downloadLink.download = `DATA_VELOCIDAD_${e.network}.${e.station}.${e.location}.${e.channel}.txt`;

              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);
            }
          }
        }
      },
      grid: {
        top: 100,
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
        name: "Velocidad",
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100,
          zoomLock: true
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
          name: 'Velocidad',
          type: 'line',
          showSymbol: false,
          data: value[0].traces_v,
          animationDelay: (idx: number) => idx * 10,
        },
      ],
      graphic: [
        {
          type: 'image',
          id: 'logo2',
          left: 'center',
          top: 'center',
          z: -10,
          bounding: 'all',
          style: {
            image: 'assets/ncnLogoColor.png',
            width: 300,
            height: 300,
            opacity: 0.2
          }
        },
        {
          type: 'text',
          z: 100,
          right: 0,
          top: 50,
          style: {
            fill: '#333',
            width: 220,
            overflow: 'break',
            text: `PGV: ${parseFloat(peakV).toFixed(5)} [${value[0].trace_v_unit}] `,
            font: '14px Microsoft YaHei'
          }
        }
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx: number) => idx * 5,
    };

    const dsp = {
      animationDuration: 5000,
      title: {
        text: `${dataformat} - Desplazamiento | ${e.network}.${e.station}.${e.location}.${e.channel}`,
        subtext: `Inicio: ${e.starttime} || Fin: ${e.endtime} || Duracion: ${h}hrs. ${m}min. ${s}seg. ${ms}ms.`,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      toolbox: {
        show: true,
        itemSize: 25,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          dataView: { readOnly: true },
          restore: {},
          saveAsImage: {},
          myDownloadButton: {
            show: true,
            title: 'Descargar Datos',
            icon: "path://M18.344,16.174l-7.98-12.856c-0.172-0.288-0.586-0.288-0.758,0L1.627,16.217c0.339-0.543-0.603,0.668,0.384,0.682h15.991C18.893,16.891,18.167,15.961,18.344,16.174 M2.789,16.008l7.196-11.6l7.224,11.6H2.789z M10.455,7.552v3.561c0,0.244-0.199,0.445-0.443,0.445s-0.443-0.201-0.443-0.445V7.552c0-0.245,0.199-0.445,0.443-0.445S10.455,7.307,10.455,7.552M10.012,12.439c-0.733,0-1.33,0.6-1.33,1.336s0.597,1.336,1.33,1.336c0.734,0,1.33-0.6,1.33-1.336S10.746,12.439,10.012,12.439M10.012,14.221c-0.244,0-0.443-0.199-0.443-0.445c0-0.244,0.199-0.445,0.443-0.445s0.443,0.201,0.443,0.445C10.455,14.021,10.256,14.221,10.012,14.221",
            onclick: function () {

              const dataX = value[0].tiempo_a;
              const dataY = value[0].traces_d;

              let dataText = '';

              for (let i = 0; i < dataX.length; i++) {
                dataText += dataX[i] + '     ' + dataY[i] + '\n';
              }

              const downloadLink = document.createElement('a');
              downloadLink.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(dataText);
              downloadLink.download = `DATA_DESPLAZAMIENTO_${e.network}.${e.station}.${e.location}.${e.channel}.txt`;

              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);
            }
          }
        }
      },
      grid: {
        top: 100,
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
        name: "Desplazamiento",
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100,
          zoomLock: true
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
          name: 'Desplazamiento',
          type: 'line',
          showSymbol: false,
          data: value[0].traces_d,
          animationDelay: (idx: number) => idx * 10,
        },
      ],
      graphic: [
        {
          type: 'image',
          id: 'logo3',
          left: 'center',
          top: 'center',
          z: -10,
          bounding: 'all',
          style: {
            image: 'assets/ncnLogoColor.png',
            width: 300,
            height: 300,
            opacity: 0.2
          }
        },
        {
          type: 'text',
          z: 100,
          right: 0,
          top: 50,
          style: {
            fill: '#333',
            width: 220,
            overflow: 'break',
            text: `PGD: ${parseFloat(peakD).toFixed(5)} [${value[0].trace_d_unit}]`,
            font: '14px Microsoft YaHei'
          }
        }
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx: number) => idx * 5,
    };

    graphArr.push(accel)
    graphArr.push(vel)
    graphArr.push(dsp)

    return graphArr

  }

  // ? Clasificacion de Estaciones

  groupedData: { [key: string]: any[] } = {};
  selectedGroup: string | null = null;

  groupByNetworkAndStation(data: any[], inv: any[]): { [key: string]: any[] } {
    const groupedD: { [key: string]: any[] } = {};

    data.forEach(item => {
      const key = `${item.network}.${item.station}`;

      if (!groupedD[key]) {
        groupedD[key] = [];
      }

      groupedD[key].push(item);
    });

    return groupedD;
  }

  selectGroup(groupKey: string): void {
    this.selectedGroup = groupKey;
  }

  getGroupValues(group: any): any[] {
    return Object.values(group.value);
  }

  // TODO: Eliminar si no se vuelve usar
  clearData() {
    localStorage.clear

    this.tabs = []
    this.actApli = []

    this.groupedData = {}
  }

  // ? Toggle Panels o Bars
  deleteFile() {

    this.tabs = []
    this.actApli = []

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

  filterData() {
    if (this.toogleTrim === true) {
      this.toogleTrim = false
    }
    this.toogleFilter = !this.toogleFilter
  }

  toggleData() {
    if (this.toogleFilter === true) {
      this.toogleFilter = false
    }
    this.toogleTrim = !this.toogleTrim
  }

  toggleStaResponsive() {
    this.showResponsivebar = !this.showResponsivebar;
  }


  // * Control de Tabs
  showtabs(bol: any): any {
    if (bol == true) {
      return { 'display': 'block' }
    } else {
      return { 'display': 'none' }
    }
  }

  onTabChange(event: MatTabChangeEvent) {
    if (event.index == -1 || !this.tabs[event.index].dataEst) {
      return
    } else {
      this.stationInfo = this.tabs[event.index].dataEst
    }
  }

  getTabLabel(tab: any): string {
    return tab.label;
  }

  onCloseTab(index: number) {
    this.tabs.splice(index, 1);
    if (this.tabs.length == 0) {
      this.hideStaPanel = true
    }
  }

  // ? Utilidades

  dateConverter(date: string) {

    const fechaHora = new Date(date);

    const año = fechaHora.getFullYear();
    const mes = fechaHora.getMonth() + 1; // Los meses comienzan desde 0
    const dia = fechaHora.getDate();
    const horas = fechaHora.getHours();
    const minutos = fechaHora.getMinutes();
    const segundos = fechaHora.getSeconds();

    const formatoFechaHora = `${dia}/${mes}/${año} ${horas}:${minutos}:${segundos}`;

    return formatoFechaHora
  }

  resetGraph(tabInfo: any) {

    var dataString: string = localStorage.getItem('urlSearched')!
    var dataFile: string = localStorage.getItem('urlFileUpload')!

    let dataToUse: string = dataFile !== "null" ? dataFile : dataString !== "null" ? dataString : "";

    this.isLoading = true

    this.obsApi.getTraceData(dataToUse, tabInfo.dataEst.station, tabInfo.dataEst.channel).subscribe({
      next: value => {

        const indx = this.tabs.findIndex((tab: { label: string; }) => tab.label === `${tabInfo.dataEst.station}.${tabInfo.dataEst.channel}`);

        if (indx !== -1) {

          const graph = this.graphGenerator(this.stationInfo, value, '(RAWDATA)')

          this.tabs[indx].graph = graph
          this.tabs[indx].base = ''
          this.tabs[indx].unit = ''
          this.cdRef.detectChanges()
        }
      },
      error: err => { this.isLoading = false },
      complete: () => {
        this.loadingSpinnerGraph = false
        this.ToggleGraph = true
        this.isLoading = false
      }
    })

  }

  filterDataT(data: any): boolean {
    const searchLower = this.buscarTexto.toLowerCase();
    return data.network.toLowerCase().includes(searchLower) ||
      data.station.toLowerCase().includes(searchLower) ||
      data.channel.toLowerCase().includes(searchLower);
  }

  setColorStationChannel(value: string): any {

    const lastLetter = value.charAt(value.length - 1)

    if (lastLetter === 'e' || lastLetter === 'E') {
      return { 'background-color': 'blue' }
    } else if (lastLetter === 'n' || lastLetter === 'N') {
      return { 'background-color': 'green' }
    } else if (lastLetter === 'z' || lastLetter === 'Z') {
      return { 'background-color': 'red' }
    } else {
      return { 'background-color': 'black' }
    }
  }

} 
