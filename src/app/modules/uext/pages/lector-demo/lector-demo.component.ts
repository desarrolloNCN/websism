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

  stationInfo: any = {}

  loadingSpinner = false
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
      order: new FormControl('', [Validators.required])
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

    // this.FilterForm = new FormGroup({
    //   type: new FormControl('', [Validators.required]),
    //   freqmin: new FormControl('', [Validators.required]),
    //   freqmax: new FormControl('', [Validators.required]),
    //   order: new FormControl('', [Validators.required])
    // })

    // this.TrimForm = new FormGroup({
    //   t_min: new FormControl('', [Validators.required]),
    //   t_max: new FormControl('', [Validators.required]),
    // })

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

    this.clearData()

    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 3 * 1000;
    snackBar.panelClass = ['snackBar-validator'];

    let textoValue = this.controlForm.get('url').value;
    let archivoValue = this.arch;

    let valorNoVacio: string | File | undefined;

    this.loadingSpinner = true

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
          // console.error('REQUEST API ERROR: ' + err.message)
          this.snackBar.open('⚠️ Fuera de Linea', 'cerrar', snackBar)
        },
        complete: () => {

          if (this.urlFile == null) {
            this.obsApi.getData(this.stringdata).subscribe({
              next: value => {
                this.groupedData = this.groupByNetworkAndStation(value.data)
              },
              error: err => {
                this.snackBar.open('Formato no Soportado', 'cerrar', snackBar)
                this.loadingSpinner = false

              },
              complete: () => {
                this.loadingSpinner = false
              }
            })

          } else if (this.stringdata == null) {
            this.obsApi.getData(this.urlFile).subscribe({
              next: value => {

                this.toggleTabs = true
                this.groupedData = this.groupByNetworkAndStation(value.data)
              },
              error: err => {
                this.snackBar.open('Formato no Soportado', 'cerrar', snackBar)
                this.loadingSpinner = false
              },
              complete: () => {
                this.loadingSpinner = false
              }
            })
          } else {
            this.snackBar.open('No se puede leer Datos', 'cerrar', snackBar)
          }

          this.loadingSpinner = false

        }
      })

    } else {
      this.snackBar.open('No se encontro ARCHIVO o URL', 'cerrar', snackBar)
      this.loadingSpinner = false
    }
  }

  createTab(e: any, value: any): void {
    this.ToggleGraph = false;

    const graph = this.graphGenerator(e, value, '(RAWDATA)');

    this.toggleTabs = true;

    const FilterForm = new FormGroup({
      type: new FormControl('', [Validators.required]),
      freqmin: new FormControl('', [Validators.required]),
      freqmax: new FormControl('', [Validators.required]),
      order: new FormControl('', [Validators.required])
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

    //this.inicializarFormularios()

    this.ToggleGraph = true;

  }

  inicializarFormularios(): void {
    this.tabs.forEach(() => {

      const FilterForm = new FormGroup({
        type: new FormControl('', [Validators.required]),
        freqmin: new FormControl('', [Validators.required]),
        freqmax: new FormControl('', [Validators.required]),
        order: new FormControl('', [Validators.required])
      })

      this.formGroups.push(FilterForm);

      const TrimForm = new FormGroup({
        t_min: new FormControl('', [Validators.required]),
        t_max: new FormControl('', [Validators.required]),
      })

      this.formGroups.push(TrimForm);
    });
    console.log(this.formGroups);
    
  }

  leer(e: any) {

    for (const elem of this.tabs) {
      if (elem.label == `${e.station}.${e.channel}`) {
        alert('Ya hay una pestaña con esa estacion')
        return
      }
    }

    // localStorage.setItem('net', e.network)
    // localStorage.setItem('sta', e.station)
    // localStorage.setItem('cha', e.channel)

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



  baseLine(menuIndex: number, index: number) {

    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 3 * 1000;
    snackBar.panelClass = ['snackBar-validator'];

    if (Object.keys(this.stationInfo).length === 0) {
      this.snackBar.open('Debe elegir una Estacion', 'cerrar', snackBar)
      return
    }

    let base = this.baseLineOptions[menuIndex]
    // localStorage.setItem('base', base)

    var dataString: string = localStorage.getItem('urlSearched')!
    var dataFile: string = localStorage.getItem('urlFileUpload')!

    let dataToUse: string = dataFile !== "null" ? dataFile : dataString !== "null" ? dataString : "";

    // let net = localStorage.getItem('net')!
    // let sta = localStorage.getItem('sta')!
    // let cha = localStorage.getItem('cha')!

    let sta = this.tabs[index].dataEst.station
    let cha = this.tabs[index].dataEst.channel

    let type = this.tabs[index].FilterForm.get('type').value
    let fmin = this.tabs[index].FilterForm.get('freqmin').value
    let fmax = this.tabs[index].FilterForm.get('freqmax').value
    let corn = this.tabs[index].FilterForm.get('order').value

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

    this.obsApi.getTraceDataBaseLine(dataToUse, sta, cha, base, type, fmin, fmax, corn, min, max).subscribe({
      next: value => {

        this.ToggleGraph = false
       

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

    // let net = localStorage.getItem('net')!
    // let sta = localStorage.getItem('sta')!
    // let cha = localStorage.getItem('cha')!
    let base = localStorage.getItem('base') || ''


    let sta = this.tabs[index].dataEst.station
    let cha = this.tabs[index].dataEst.channel

    let type = this.tabs[index].FilterForm.get('type').value
    let fmin = this.tabs[index].FilterForm.get('freqmin').value
    let fmax = this.tabs[index].FilterForm.get('freqmax').value
    let corn = this.tabs[index].FilterForm.get('order').value

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

    this.obsApi.getTraceDataFilter(dataToUse, sta, cha, base, type, fmin, fmax, corn, min, max).subscribe({
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

    // let net = localStorage.getItem('net')!
    // let sta = localStorage.getItem('sta')!
    // let cha = localStorage.getItem('cha')!
    let base = localStorage.getItem('base') || ''

    let sta = this.tabs[index].dataEst.station
    let cha = this.tabs[index].dataEst.channel

    const t_min = parseFloat(this.tabs[index].TrimForm.get('t_min').value);
    const t_max = parseFloat(this.tabs[index].TrimForm.get('t_max').value);

    let type = this.tabs[index].FilterForm.get('type').value
    let fmin = this.tabs[index].FilterForm.get('freqmin').value
    let fmax = this.tabs[index].FilterForm.get('freqmax').value
    let corn = this.tabs[index].FilterForm.get('order').value

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

    this.obsApi.getTraceDataTrim(dataToUse, sta, cha, base, type, fmin, fmax, corn, min, max).subscribe({
      next: value => {

        this.ToggleGraph = false
        this.loadingSpinnerData = true
      
        // const indx = this.tabs.findIndex((tab: { index: number; }) => tab.index === index)
        const indx = this.tabs.findIndex((tab: { label: string; }) => tab.label === `${sta}.${cha}`);

        if (indx !== -1) {

          const graph = this.graphGenerator(this.stationInfo, value, '(MODIFIED)')

          this.tabs[indx].graph = graph;

          // Manualmente activar la detección de cambios para la pestaña actualizada
          this.cdRef.detectChanges();
        }

        console.log(this.tabs);

      },
      error: err => {
        this.snackBar.open('No hay Datos para Renderizar', 'cerrar', snackBar)
        this.loadingSpinnerGraph = false
        console.error('REQUEST API ERROR: ' + err.message)
      },
      complete: () => {
        this.actApli.push(`Trim: ${t_max-t_min}seg a ${sta}.${cha}`)

        this.loadingSpinnerData = false

        this.ToggleGraph = true

        this.isLoading = false
      }
    })
  }



  deleteFile() {

    this.tabs = []
    this.actApli = []

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

  onTabChange(event: MatTabChangeEvent) {
    if (!this.tabs[event.index].dataEst) {
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
  }

  graphGenerator(e: any, value: any, dataformat: any) {

    const st = new Date(e.starttime).getTime()
    const et = new Date(e.endtime).getTime()


    const diff = et - st;
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    const ms = diff % 1000;

    const graphArr: any = []

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
          saveAsImage: {}
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
        name: "Aceleracion (cm/s^2)",
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
          saveAsImage: {}
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
        name: "Velocidad (cm/s)",
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
          name: 'Velocidad (cm/s)',
          type: 'line',
          showSymbol: false,
          data: value[0].traces_v,
          animationDelay: (idx: number) => idx * 10,
        },
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
          saveAsImage: {}
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
        name: "Desplazamiento (cm) ",
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
          name: 'Desplazamiento (cm)',
          type: 'line',
          showSymbol: false,
          data: value[0].traces_d,
          animationDelay: (idx: number) => idx * 10,
        },
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx: number) => idx * 5,
    };

    graphArr.push(accel)
    graphArr.push(vel)
    graphArr.push(dsp)

    return graphArr

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

  showtabs(bol: any): any {
    if (bol == true) {
      return { 'display': 'block' }
    } else {
      return { 'display': 'none' }
    }
  }

  clearData() {
    localStorage.clear
    this.tabs = []
    this.actApli = []

    this.accel = {}
    this.vel = {}
    this.dsp = {}

    this.groupedData = {}
  }

}
