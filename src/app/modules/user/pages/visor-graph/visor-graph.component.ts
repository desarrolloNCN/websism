import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { DecimalPipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatTab, MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { EChartsOption } from 'echarts';
import { Subscription, catchError, concatMap, forkJoin, from, map, mergeMap, throwError } from 'rxjs';
import { ArchivoMseedComponent } from 'src/app/modules/uext/componentes/archivo-mseed/archivo-mseed.component';
import { ArchivoTXTComponent } from 'src/app/modules/uext/componentes/archivo-txt/archivo-txt.component';
import { RegisterDialogComponent } from 'src/app/modules/uext/componentes/register-dialog/register-dialog.component';
import { ObspyAPIService } from 'src/app/service/obspy-api.service';
import { AmplitudFourierComponent } from '../../componentes/amplitud-fourier/amplitud-fourier.component';
import { EspectroFourierComponent } from '../../componentes/espectro-fourier/espectro-fourier.component';
import { CustomEvent, ImageViewerConfig } from 'ngx-image-viewer';
import { AuthService } from 'src/app/service/auth.service';
import { SismosHistoricosComponent } from 'src/app/modules/uext/componentes/sismos-historicos/sismos-historicos.component';
import { RegisterUserService } from 'src/app/service/register-user.service';
import { LabelType, Options } from '@angular-slider/ngx-slider';

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
    trigger('infinitePulseAnimation', [
      transition('* <=> *', [
        animate('2000ms ease-in-out', keyframes([
          style({ transform: 'scale(1)', offset: 0 }),
          style({ transform: 'scale(1.1)', offset: 0.5 }),
          style({ transform: 'scale(1)', offset: 1.0 })
        ]))
      ])
    ])
  ],
  templateUrl: './visor-graph.component.html',
  styleUrls: ['./visor-graph.component.css'],

})
export class VisorGraphComponent implements OnInit {

  private navigationSubscription: Subscription;

  accel: EChartsOption | any;
  vel: EChartsOption | any;
  dsp: EChartsOption | any;

  controlForm: FormGroup | any
  FilterForm: FormGroup | any
  TrimForm: FormGroup | any

  enproges = false

  arch: File[] | any = ''
  archFilter = ''
  buscarTexto: string = '';

  stationInfo: any = {}
  colorGraph = '#0000ff'

  loadingSpinner = false
  loadingBarGraph = false
  loadingSpinnerStaInfo = false
  loadingSpinnerGraph = false
  loadingSpinnerData = false
  loadingPanelInfo = false

  isLoading = false

  ToggleGraph = false
  toggleTabs = false

  btnShow = false
  btnCancel = true
  btnDisable = false
  btnSisHide = false

  isButtonActive = false
  panelOpenState = false

  hideStaPanel = true
  hideStaPanel2 = true
  showResponsivebar = false


  urlFile = ''
  original_unit = ''
  idFile = ''
  stringdata = ''
  formatFile = ''
  private userInfo = ''
  private group: any
  private groupNro: any
  name = ''
  usere = ''

  // TODO: cambiar esto en Produccion a -1, 1 en dev
  userId = -1

  plotedimages: any = []

  toogleTrim = false
  toogleFilter = false

  hideToolTip = false

  baseLineOptions = ['constant', 'linear', 'demean', 'simple']
  unitConvertOptions = ['cm/s2 [GaL]', 'm/s2', 'G', 'mg', 'unk']

  tabs: any = []
  matTabs: MatTab[] = []
  tabIndex = 0
  lastIndexTab = 0

  actApli: any = []

  formGroups: FormGroup[] = [];

  stopXmr: Subscription | any
  stopMseed: Subscription | any
  stopTxt: Subscription | any
  stopData: Subscription | any
  stopProjData: Subscription | any
  graphClientOption = false

  proyectData: any[] = [];
  proyectDataIn: any[] = [];

  constructor(
    private obsApi: ObspyAPIService,
    private obsUser: RegisterUserService,

    private auth: AuthService,
    private snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef,
    private matDialog: MatDialog,
    private router: Router,
    private decimalPipe: DecimalPipe,

    private route: ActivatedRoute
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

    this.reloadSettingUser()

    this.navigationSubscription = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        let textoValue = this.controlForm.get('url').value;
        let archivoValue = this.arch;
        let valorNoVacio = archivoValue || textoValue

        if (valorNoVacio != '' || this.proyectData.length > 0) {
          this.showWarning();
        }

      }
    });

  }

  reloadSettingUser() {
    this.auth.getToken().subscribe({
      next: value => {

        if (value.username == null || value.email == null) {
          // TODO: cambiar esto en Produccion a -1, 1 en dev
          this.userId == -1
        } else {
          this.group = value.groups
          this.name = value.name

          if (this.group['10']) {
            this.groupNro = 10
          } else {
            this.groupNro = 2
          }
          this.auth.nUser(value.username, value.email, this.groupNro).subscribe({
            next: nvalue => {
              this.userId = nvalue
            }
          })
        }

        if (value.modo_grafico == null || value.modo_grafico == 'no') {
          this.colorGraph = value.color_grafico
          this.graphClientOption = true
        } else {
          this.graphClientOption = false
        }
      },
      error: err => {
        //TODO: cambiar esto en Produccion a -1, 1 en dev
        this.userId == -1
        this.graphClientOption = true
      },
    })
  }

  ngOnInit(): void {
    localStorage.clear()

    this.obsUser.data.subscribe({
      next: valueD => {

        if (valueD == null) {
          this.proyectData = []
          this.btnSisHide = false
        } else {

          this.loadingPanelInfo = true

          this.btnSisHide = true

          this.proyectData = valueD
          console.log('Visor OnInit', this.proyectData);

          from(this.proyectData).pipe(
            concatMap((e: any, index: number) =>
              this.obsApi.getData(e.urlconvert).pipe(
                map((value: any) => {
                  if (value.data[0].und_calib == 'M/S**2') {
                    e.unit = 'm';
                  } else if (value.data[0].und_calib == 'CM/S**2' || e.extension == 'EVT' || e.extension == 'KINEMETRICS_EVT') {
                    e.unit = 'gal';
                  } else if (value.data[0].und_calib == 'G') {
                    e.unit = 'g';
                  }

                  this.toggleTabs = true;
                  this.groupedData = this.groupByNetworkAndStation(value.data, value.inv);
                  this.proyectData[index].stations = this.groupedData;

                  this.leer(value.data[0], index);
                })
              )
            )
          ).subscribe({
            complete: () => {
              this.loadingPanelInfo = false;
            }
          });

          // this.proyectData.forEach((e: any, index: number) => {

          //   this.obsApi.getData(e.url).subscribe({
          //     next: value => {

          //       if (value.data[0].und_calib == 'M/S**2') {
          //         e.unit = 'm'
          //       } else if (value.data[0].und_calib == 'CM/S**2' || e.extension == 'EVT' || e.extension == 'MSEED') {
          //         e.unit = 'gal'
          //       } else if (value.data[0].und_calib == 'G') {
          //         e.unit = 'g'
          //       } else {
          //         e.unit = ''
          //       }

          //       this.toggleTabs = true
          //       this.groupedData = this.groupByNetworkAndStation(value.data, value.inv)
          //       this.proyectData[index].stations = this.groupedData

          //       this.leer(value.data[0], 0)
          //     },
          //     complete: () => {
          //       this.loadingPanelInfo = false
          //     }
          //   })

          // });



        }


      },
      error: err => {
        this.proyectData = []
      }
    });

    this.obsApi.getIpAddress().subscribe({
      next: value => {
        this.userInfo = value.ip
      }
    })

    this.controlForm = new FormGroup({
      url: new FormControl(''),

    })

  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
      this.obsUser.resetService()
      this.deleteFile()
    }
  }

  showWarning() {
    const confirmed = window.confirm('-¿Estás seguro de que deseas abandonar esta página?');
    if (!confirmed) {
      this.obsUser.resetService()
      this.deleteFile()
      this.router.navigate(['/user/lectorAcel']);
    } else {
      return
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    const confirmationMessage = '¿Estás seguro de que deseas abandonar esta página?';
    $event.returnValue = confirmationMessage;
    return confirmationMessage;
  }


  onFileSelected(event: any) {
    let archivos = event.target.files;
    this.controlForm.get('url').setValue('')

    if (archivos && archivos.length > 0) {
      this.arch = archivos[0];

      let ext: string = archivos[0].name.substring(archivos[0].name.lastIndexOf('.') + 1);
      this.archFilter = this.txtElip(archivos[0].name, ext, 20)



      this.btnShow = true;
      this.btnCancel = false;

      this.controlForm.get('url').disable()
    } else {
      this.btnShow = false;
      this.btnCancel = true;
      this.arch = null;
    }
  }

  imageIndex = 0

  config: ImageViewerConfig = {
    btnClass: 'btnImageViewerx',
    zoomFactor: 0.1,
    containerBackgroundColor: '#ccc',
    wheelZoom: true,
    allowFullscreen: true,
    btnShow: {
      zoomIn: true,
      zoomOut: true,
      rotateClockwise: true,
      rotateCounterClockwise: true,
    },
    customBtns: [
      {
        name: "descargar",
        icon: "fa fa-download"
      }
    ]
  };

  handleEvent(event: CustomEvent, index: number) {
    let net = this.tabs[index].dataEst.network
    let loc = this.tabs[index].dataEst.location
    let sta = this.tabs[index].dataEst.station
    let cha = this.tabs[index].dataEst.channel

    switch (event.name) {
      case 'descargar':
        const url = this.tabs[index].img
        fetch(url)
          .then(response => response.blob())
          .then(blob => {
            const url = window.URL.createObjectURL(blob);

            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.download = `IMG__${net}.${sta}.${loc}.${cha}.png`;

            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            window.URL.revokeObjectURL(url);
          })
          .catch(error => console.error('Error al descargar la imagen:', error));
        break;
    }
  }



  @ViewChild('fileInput') fileInput!: ElementRef

  leerArchivo() {
    this.clearData()

    this.btnDisable = true

    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 5 * 1000;
    snackBar.panelClass = ['snackBar-validator'];

    let textoValue = this.controlForm.get('url').value;
    this.controlForm.disable();
    let archivoValue = this.arch;


    let valorNoVacio: string | File | undefined;

    this.loadingSpinner = true
    this.loadingSpinnerStaInfo = true
    this.loadingPanelInfo = true

    this.snackBar.open('⌛ Cargando Datos ...', '', snackBar)

    if (archivoValue instanceof File || typeof textoValue === 'string' && textoValue.trim() !== '') {

      valorNoVacio = archivoValue || textoValue

      let nvr: string = archivoValue.name || textoValue
      let na: string = nvr.substring(nvr.lastIndexOf('/') + 1);
      let ext: string = na.substring(na.lastIndexOf('.') + 1);
      let forFi: string = ''

      try {
        if (ext == 'XMR') {
          this.stopXmr = this.obsApi.covertionXMR(archivoValue).subscribe({
            next: value => {
              this.leerTxt(value.url)
            },
            error: err => {
              this.snackBar.open('⚠️ Error al Leer Archivo', 'cerrar', snackBar)
              this.loadingSpinner = false
              this.loadingSpinnerStaInfo = false
            },
            complete: () => {
              this.loadingSpinner = false
              this.loadingSpinnerStaInfo = false
            }
          })
        } else {
          this.stopXmr.unsubscribe()
          throw new Error('')
        }
      } catch (err) {
        this.obsUser.uploadFileUser(valorNoVacio, this.userId.toString()).subscribe({
          next: value => {

            this.proyectData.push({
              "originalName": na,
              "urlconvert": value.file || value.string_data,
              "format": value.f,
              "unit": ''
            })

            //localStorage.setItem('urlFileUpload', value.file)
            //localStorage.setItem('urlSearched', value.string_data)

            // this.formatFile = value.f

          },
          error: err => {
            this.controlForm.enable()
            this.loadingSpinner = false
            this.loadingSpinnerStaInfo = false
            this.btnDisable = false
            this.snackBar.open('⚠️ ' + err.error.error, 'cerrar', snackBar)
          },
          complete: () => {

            let url = this.proyectData[0].urlconvert

            if (ext == 'txt') {
              this.leerTxt(url)
            } else if (this.proyectData[0].format == 'MSEED' || ext == 'mseed') {
              this.leerMseed(url)
            } else {
              this.obsApi.getData(url).subscribe({
                next: value => {

                  if (value.data[0].und_calib == 'M/S**2') {
                    this.proyectData[0].unit = 'm'
                    //localStorage.setItem('ogUnit', 'm')
                  } else if (value.data[0].und_calib == 'CM/S**2' || ext == 'evt' || this.proyectData[0].format == 'REFTEK130') {
                    this.proyectData[0].unit = 'gal'
                    //localStorage.setItem('ogUnit', 'gal')
                  } else if (value.data[0].und_calib == 'G') {
                    this.proyectData[0].unit = 'g'
                    //localStorage.setItem('ogUnit', 'g')
                  } else {
                    this.proyectData[0].unit = ''
                    //localStorage.setItem('ogUnit', '')
                  }
                  this.toggleTabs = true

                  this.groupedData = this.groupByNetworkAndStation(value.data, value.inv)
                  this.proyectData[0].stations = this.groupedData


                  this.leer(value.data[0], 0)
                },
                error: err => {
                  this.snackBar.open('Formato no Soportado', 'cerrar', snackBar)
                  this.loadingSpinner = false
                  this.loadingSpinnerStaInfo = false
                  this.btnDisable = false
                },
                complete: () => {
                  this.loadingSpinner = false
                  this.loadingSpinnerStaInfo = false
                  this.loadingPanelInfo = false
                  this.btnDisable = false
                }
              })
            }
          }
        })
      }

    } else {
      this.snackBar.open('❗ No se encontro ARCHIVO o URL', 'cerrar', snackBar)
      this.controlForm.enable()
      this.loadingSpinner = false
      this.loadingSpinnerStaInfo = false
      this.btnDisable = false
    }


  }

  txtElip(nombre: string, extension: string, longitudVisible: number) {
    const longitudExtension = extension.length + 1;
    const longitudSinExtension = nombre.length - longitudExtension;

    if (longitudSinExtension > longitudVisible) {
      const parteVisible = nombre.substring(0, longitudVisible);
      return parteVisible + '...' + extension;
    } else {
      return nombre;
    }
  }

  async leerTxt(url: string) {

    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 5 * 1000;
    snackBar.panelClass = ['snackBar-validator'];

    const matDialogConfig = new MatDialogConfig()
    matDialogConfig.disableClose = true;
    matDialogConfig.data = url

    this.loadingSpinnerStaInfo = true
    this.loadingPanelInfo = true

    this.matDialog.open(ArchivoTXTComponent, matDialogConfig).afterClosed()
      .subscribe({
        next: value => {

          // this.toggleTabs = true

          if (value.url == '') {
            this.loadingPanelInfo = false
            this.proyectData = []
            this.loadingSpinner = false
            this.loadingSpinnerStaInfo = false
            this.btnDisable = false
            return

          } else {

            this.proyectData[0].urlconvert = value.url
            this.proyectData[0].unit = value.unit


            this.stopTxt = this.obsApi.getData(value.url).subscribe({
              next: value => {
                this.toggleTabs = true

                this.groupedData = this.groupByNetworkAndStation(value.data, value.inv)
                this.proyectData[0].stations = this.groupedData

                this.leer(value.data[0], 0)

              },
              error: err => {
                this.snackBar.open('⚠️ Error al Leer Datos', 'cerrar', snackBar)
                this.loadingPanelInfo = false
                this.loadingSpinner = false
                this.loadingSpinnerStaInfo = false
                this.btnDisable = false
              },
              complete: () => {
                this.loadingPanelInfo = false
                this.loadingSpinner = false
                this.loadingSpinnerStaInfo = false
                this.btnDisable = false
              }
            })


          }
        },
        error: err => {
          this.snackBar.open('⚠️ Error al mostrar Datos ', 'cerrar', snackBar)
          this.loadingSpinner = false
          this.loadingSpinnerStaInfo = false
          this.btnDisable = false
          this.loadingPanelInfo = false
        },
        complete: () => {
          this.loadingSpinner = false
        }
      }

      )

  }

  async leerMseed(url: string) {

    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 5 * 1000;
    snackBar.panelClass = ['snackBar-validator'];

    const matDialogConfig = new MatDialogConfig()
    matDialogConfig.disableClose = true;
    matDialogConfig.data = url

    this.loadingSpinnerStaInfo = true

    this.matDialog.open(ArchivoMseedComponent, matDialogConfig).afterClosed()
      .subscribe({
        next: valueUrl => {
          // this.toggleTabs = true
          if (valueUrl.url == '') {
            this.loadingPanelInfo = false
            this.proyectData = []
            this.loadingSpinner = false
            this.loadingSpinnerStaInfo = false
            this.btnDisable = false
            return

          } else {

            this.loadingPanelInfo = true

            this.proyectData[0].urlconvert = valueUrl.url
            this.proyectData[0].unit = valueUrl.unit

            // this.urlFile = valueUrl.url
            // this.original_unit = valueUrl.unit

            // localStorage.setItem('urlFileUpload', valueUrl.url)
            // localStorage.setItem('ogUnit', valueUrl.unit)

            this.stopMseed = this.obsApi.getData(this.proyectData[0].urlconvert).subscribe({
              next: value => {
                this.toggleTabs = true

                this.groupedData = this.groupByNetworkAndStation(value.data, value.inv)
                this.proyectData[0].stations = this.groupedData


                this.leer(value.data[0], 0)

                // this.groupedData = this.groupByNetworkAndStation(value.data, value.inv)
                // this.leer(value.data[0])
              },
              error: err => {
                this.snackBar.open('⚠️ Error al leer el XML', 'cerrar', snackBar)
                this.loadingSpinner = false
                this.loadingSpinnerStaInfo = false
                this.btnDisable = false
                this.loadingPanelInfo = false
              },
              complete: () => {
                this.loadingPanelInfo = false
                this.loadingSpinner = false
                this.loadingSpinnerStaInfo = false
                this.btnDisable = false
              }
            })
          }

        },
        error: err => {
          this.snackBar.open('⚠️ Error ', 'cerrar', snackBar)
          this.loadingSpinner = false
          this.loadingSpinnerStaInfo = false
          this.btnDisable = false
          this.loadingPanelInfo = false
          this.loadingPanelInfo = false
        },
        complete: () => {
          this.loadingSpinner = false
          this.loadingPanelInfo = false
        }
      }

      )

  }

  leer(e: any, indexFile?: number) {

    for (const elem of this.tabs) {
      if (elem.label == `${e.station}.${e.channel}`) {
        alert('Ya hay una pestaña con esa estacion')
        break
      }
    }

    this.loadingSpinnerGraph = true
    this.loadingBarGraph = true
    this.ToggleGraph = false
    this.toggleTabs = false

    this.stationInfo = e

    var dataString, dataFile = this.proyectData[indexFile || 0].urlconvert
    var og_unit: string = this.proyectData[indexFile || 0].unit


    let dataToUse: string = dataFile !== "null" ? dataFile : dataString !== "null" ? dataString : "";

    this.auth.getToken().subscribe({
      next: value => {
        this.colorGraph = value.color_grafico

        if (value.modo_grafico == null || value.modo_grafico == 'no') {

          this.graphClientOption = true

          this.obsApi.plotGraph(dataToUse, e.station, e.channel, og_unit, this.colorGraph).subscribe({
            next: val => {
              if (!val.url) {
                this.createTab(e, val, '', this.colorGraph, indexFile)
              } else {
                this.createTab(e, val, val.url, this.colorGraph, indexFile)
              }
            },
            error: err => {
              this.loadingBarGraph = false
            },
            complete: () => {
              this.loadingSpinnerGraph = false
              this.loadingBarGraph = false
              this.ToggleGraph = true
            }

          })

        } else {

          this.graphClientOption = false

          this.obsApi.getTraceData(dataToUse, e.station, e.channel, og_unit).subscribe({
            next: value => { this.createTab(e, value, '', this.colorGraph, indexFile) },
            error: err => {
              this.loadingBarGraph = false
            },
            complete: () => {
              this.loadingSpinnerGraph = false
              this.loadingBarGraph = false
              this.ToggleGraph = true
            }
          })

        }
      },
      error: err => {
        this.graphClientOption = true
        this.obsApi.plotGraph(dataToUse, e.station, e.channel, og_unit).subscribe({
          next: val => {
            if (!val.url) {
              this.createTab(e, val, '', this.colorGraph, indexFile)
            } else {
              this.createTab(e, val, val.url, this.colorGraph, indexFile)
            }
          },
          error: err => {
            this.loadingBarGraph = false
          },
          complete: () => {
            this.loadingSpinnerGraph = false
            this.loadingBarGraph = false
            this.ToggleGraph = true
          }

        })
        // this.graphClientOption = true
        // this.loadingBarGraph = false
      },

    })

  }

  // ! Creacion de Tabs

  createTab(e: any, value: any, img: string, graphC?: string, indexFilePanel?: number): void {

    this.ToggleGraph = false;

    let graph = ''

    if (this.graphClientOption) {
      graph = ''
    } else {
      graph = this.graphGenerator(e, value, '(RAWDATA)', graphC || '#5470c6');
    }

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
      sliderControl: new FormControl([20, 80])
    })



    const st = new Date(e.starttime).getTime()
    const et = new Date(e.endtime).getTime()

    const diff = et - st;
    const s = diff / 1000

    let sliderOption: Options = {
      floor: 0,
      ceil: s,
      step: 0.1,
      tickStep: 0.1,
      translate: (value: number, label: LabelType): string => {
        switch (label) {
          case LabelType.Low:
            return value + ' seg.';
          case LabelType.High:
            return value + ' seg.';
          default:
            return '' + value;
        }
      }
    }

    this.tabs.push({
      label: `${e.station}.${e.channel}`,
      dataEst: e,
      sttime: e.starttime,
      entime: e.endtime,
      FilterForm,
      TrimForm,
      graph,
      indexFilePanel: indexFilePanel,
      img,
      sliderOption,
      tmin: 0,
      tmax: s
    });

    this.lastIndexTab = this.tabs.length - 1

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

    let indexFilePanel = this.tabs[index].indexFilePanel || 0

    var dataString, dataFile = this.proyectData[indexFilePanel].urlconvert
    var unit_from: string = this.proyectData[indexFilePanel].unit

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
    this.isLoading =
      this.loadingBarGraph = true

    this.auth.getToken().subscribe({
      next: value => {
        this.colorGraph = value.color_grafico

        if (value.modo_grafico == null || value.modo_grafico == 'no') {

          this.graphClientOption = true


          this.obsApi.plotToolGraph(dataToUse, sta, cha, base, type, fmin, fmax, corn, zero, min, max, unit_from, unit, this.colorGraph).subscribe({
            next: value => {
              const indx = this.tabs.findIndex((tab: { label: string; }) => tab.label === `${sta}.${cha}`);
              if (indx !== -1) {

                this.tabs[indx].img = value.url
                this.tabs[indx].base = base
                this.cdRef.detectChanges();
              }
            },
            complete: () => {
              this.loadingBarGraph = false
            }
          })
        } else {
          this.graphClientOption = false
          this.obsApi.getTraceDataBaseLine(dataToUse, sta, cha, base, type, fmin, fmax, corn, zero, min, max, unit_from, unit).subscribe({
            next: value => {

              this.ToggleGraph = false


              const indx = this.tabs.findIndex((tab: { label: string; }) => tab.label === `${sta}.${cha}`);

              if (indx !== -1) {

                const graph = this.graphGenerator(this.stationInfo, value, '(MODIFIED)', this.colorGraph)

                this.tabs[indx].graph = graph;
                this.tabs[indx].base = base

                this.cdRef.detectChanges();
              }


            },
            error: err => {
              this.snackBar.open('No hay Datos para Renderizar', 'cerrar', snackBar)
              this.loadingSpinnerGraph = false
            },
            complete: () => {
              this.actApli.push(`Linea Base: ${base} a ${sta}.${cha}`)
              this.loadingSpinnerData = false
              this.loadingBarGraph = false
              this.ToggleGraph = true
              this.isLoading = false
            }
          })
        }
      },
      error: err => {
        this.obsApi.plotToolGraph(dataToUse, sta, cha, base, type, fmin, fmax, corn, zero, min, max, unit_from, unit, this.colorGraph).subscribe({
          next: value => {
            const indx = this.tabs.findIndex((tab: { label: string; }) => tab.label === `${sta}.${cha}`);
            if (indx !== -1) {

              this.tabs[indx].img = value.url
              this.tabs[indx].base = base
              this.cdRef.detectChanges();
            }
          },
          complete: () => {
            this.loadingSpinnerGraph = false
            this.loadingBarGraph = false
            this.ToggleGraph = true
          }
        })
      },
    })


  }

  filter(index: number) {
    this.filterData()
    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 3 * 1000;
    snackBar.panelClass = ['snackBar-validator'];

    let indexFilePanel = this.tabs[index].indexFilePanel || 0

    var dataString, dataFile = this.proyectData[indexFilePanel].urlconvert
    var unit_from: string = this.proyectData[indexFilePanel].unit

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
    this.loadingBarGraph = true

    this.auth.getToken().subscribe({
      next: value => {

        this.colorGraph = value.color_grafico

        if (value.modo_grafico == null || value.modo_grafico == 'no') {
          this.graphClientOption = true
          this.obsApi.plotToolGraph(dataToUse, sta, cha, base, type, fmin, fmax, corn, zero, min, max, unit_from, unit, this.colorGraph).subscribe({

            next: value => {
              const indx = this.tabs.findIndex((tab: { label: string; }) => tab.label === `${sta}.${cha}`);

              if (indx !== -1) {
                this.tabs[indx].img = value.url
                this.cdRef.detectChanges();
              }
            },
            complete: () => {
              this.loadingBarGraph = false

            }
          })
        } else {
          this.graphClientOption = false
          this.obsApi.getTraceDataFilter(dataToUse, sta, cha, base, type, fmin, fmax, corn, zero, min, max, unit_from, unit).subscribe({
            next: value => {

              this.ToggleGraph = false
              this.loadingSpinnerData = true

              const indx = this.tabs.findIndex((tab: { label: string; }) => tab.label === `${sta}.${cha}`);

              if (indx !== -1) {

                const graph = this.graphGenerator(this.stationInfo, value, '(MODIFIED)', this.colorGraph)

                this.tabs[indx].graph = graph;

                // Manualmente activar la detección de cambios para la pestaña actualizada
                this.cdRef.detectChanges();
              }

            },
            error: err => {
              this.snackBar.open('No hay Datos para Renderizar', 'cerrar', snackBar)
              this.loadingSpinnerGraph = false
            },
            complete: () => {
              this.actApli.push(`Filtro: ${type} a ${sta}.${cha}`)

              this.loadingSpinnerData = false
              this.loadingBarGraph = false
              this.ToggleGraph = true
              this.toogleFilter = false
              this.isLoading = false
            }
          })
        }
      },
      error: err => {
        this.graphClientOption = true

        this.obsApi.plotToolGraph(dataToUse, sta, cha, base, type, fmin, fmax, corn, zero, min, max, unit_from, unit, this.colorGraph).subscribe({

          next: value => {
            const indx = this.tabs.findIndex((tab: { label: string; }) => tab.label === `${sta}.${cha}`);

            if (indx !== -1) {
              this.tabs[indx].img = value.url
              this.cdRef.detectChanges();
            }
          },
          complete: () => {
            this.loadingBarGraph = false

          }
        })

      },
    })


  }

  trim(index: number) {
    this.toggleData()
    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 3 * 1000;
    snackBar.panelClass = ['snackBar-validator'];

    let indexFilePanel = this.tabs[index].indexFilePanel || 0

    var dataString, dataFile = this.proyectData[indexFilePanel].urlconvert
    var unit_from: string = this.proyectData[indexFilePanel].unit

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

    this.loadingBarGraph = true

    this.auth.getToken().subscribe({
      next: value => {

        this.colorGraph = value.color_grafico

        if (value.modo_grafico == null || value.modo_grafico == 'no') {
          this.graphClientOption = true
          this.obsApi.plotToolGraph(dataToUse, sta, cha, base, type, fmin, fmax, corn, zero, min, max, unit_from, unit, this.colorGraph).subscribe({
            next: value => {
              const indx = this.tabs.findIndex((tab: { label: string; }) => tab.label === `${sta}.${cha}`);
              if (indx !== -1) {

                this.tabs[indx].img = value.url
                this.cdRef.detectChanges();
              }
            },
            complete: () => {
              this.loadingBarGraph = false
            }
          })
        } else {
          this.graphClientOption = false
          this.obsApi.getTraceDataTrim(dataToUse, sta, cha, base, type, fmin, fmax, corn, zero, min, max, unit_from, unit).subscribe({
            next: value => {

              this.ToggleGraph = false
              this.loadingSpinnerData = true

              // const indx = this.tabs.findIndex((tab: { index: number; }) => tab.index === index)
              const indx = this.tabs.findIndex((tab: { label: string; }) => tab.label === `${sta}.${cha}`);

              if (indx !== -1) {

                const graph = this.graphGenerator(this.stationInfo, value, '(MODIFIED)', this.colorGraph)

                this.tabs[indx].graph = graph;

                this.cdRef.detectChanges();
              }

            },
            error: err => {
              this.snackBar.open('No hay Datos para Renderizar', 'cerrar', snackBar)
              this.loadingSpinnerGraph = false
            },
            complete: () => {
              this.actApli.push(`Trim: ${t_max - t_min}seg a ${sta}.${cha}`)

              this.loadingSpinnerData = false

              this.loadingBarGraph = false

              this.ToggleGraph = true

              this.isLoading = false

              this.toogleFilter = false
            }
          })
        }
      },
      error: err => {
        this.graphClientOption = true
        this.obsApi.plotToolGraph(dataToUse, sta, cha, base, type, fmin, fmax, corn, zero, min, max, unit_from, unit, this.colorGraph).subscribe({
          next: value => {
            const indx = this.tabs.findIndex((tab: { label: string; }) => tab.label === `${sta}.${cha}`);
            if (indx !== -1) {

              this.tabs[indx].img = value.url
              this.cdRef.detectChanges();
            }
          },
          complete: () => {
            this.loadingBarGraph = false
          }
        })
      },

    })

  }

  unitConverter(menuIndex: number, index: number) {

    this.reloadSettingUser()

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
      'mg': 'mg',
      'unk': ''
    };

    let unit_to = this.unitConvertOptions[menuIndex];
    unit_to = unitMap[unit_to] || '';

    let indexFilePanel = this.tabs[index].indexFilePanel || 0

    var dataString, dataFile = this.proyectData[indexFilePanel].urlconvert
    var unit_from: string = this.proyectData[indexFilePanel].unit

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

    this.loadingBarGraph = true

    this.auth.getToken().subscribe({
      next: value => {

        this.colorGraph = value.color_grafico

        if (value.modo_grafico == null || value.modo_grafico == 'no') {
          this.graphClientOption = true
          this.obsApi.plotToolGraph(dataToUse, sta, cha, base, type, fmin, fmax, corn, zero, min, max, unit_from, unit_to, this.colorGraph).subscribe({
            next: value => {
              const indx = this.tabs.findIndex((tab: { label: string; }) => tab.label === `${sta}.${cha}`);
              if (indx !== -1) {

                this.tabs[indx].img = value.url
                this.tabs[indx].unit = unit_to
                this.cdRef.detectChanges();
              }
            },
            complete: () => {
              this.loadingBarGraph = false
            }
          })
        } else {
          this.graphClientOption = false
          this.obsApi.unitConvertion(dataToUse, sta, cha, base, type, fmin, fmax, corn, zero, min, max, unit_from, unit_to, this.colorGraph).subscribe({
            next: value => {

              this.ToggleGraph = false


              const indx = this.tabs.findIndex((tab: { label: string; }) => tab.label === `${sta}.${cha}`);

              if (indx !== -1) {

                const graph = this.graphGenerator(this.stationInfo, value, '(MODIFIED)', this.colorGraph)

                this.tabs[indx].graph = graph;
                this.tabs[indx].unit = unit_to

                this.cdRef.detectChanges();
              }


            },
            error: err => {
              this.snackBar.open('No hay Datos para Renderizar', 'cerrar', snackBar)
              this.loadingSpinnerGraph = false
            },
            complete: () => {
              this.actApli.push(`Linea Base: ${base} a ${sta}.${cha}`)
              this.loadingSpinnerData = false
              this.loadingBarGraph = false
              this.ToggleGraph = true
              this.isLoading = false
            }
          })
        }
      },
      error: err => {
        this.graphClientOption = true
        this.obsApi.plotToolGraph(dataToUse, sta, cha, base, type, fmin, fmax, corn, zero, min, max, unit_from, unit_to, this.colorGraph).subscribe({
          next: value => {
            const indx = this.tabs.findIndex((tab: { label: string; }) => tab.label === `${sta}.${cha}`);
            if (indx !== -1) {

              this.tabs[indx].img = value.url
              this.tabs[indx].unit = unit_to
              this.cdRef.detectChanges();
            }
          },
          complete: () => {
            this.loadingBarGraph = false
          }
        })
      },

    })

  }

  autoAjuste(index: number) {

    this.reloadSettingUser()
    console.log();

    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 3 * 1000;
    snackBar.panelClass = ['snackBar-validator'];

    let indexFilePanel = this.tabs[index].indexFilePanel || 0

    var dataString, dataFile = this.proyectData[indexFilePanel].urlconvert
    var unit_from: string = this.proyectData[indexFilePanel].unit

    this.tabs[index].base = 'linear'
    this.tabs[index].unit = 'gal'

    this.tabs[index].FilterForm.controls['type'].setValue('bandpass')
    this.tabs[index].FilterForm.controls['freqmin'].setValue(0.1)
    this.tabs[index].FilterForm.controls['freqmax'].setValue(25)
    this.tabs[index].FilterForm.controls['order'].setValue(2)
    this.tabs[index].FilterForm.controls['zero'].setValue(true)

    let dataToUse: string = dataFile !== "null" ? dataFile : dataString !== "null" ? dataString : "";

    let sta = this.tabs[index].dataEst.station
    let cha = this.tabs[index].dataEst.channel

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

    this.loadingBarGraph = true

    this.auth.getToken().subscribe({
      next: value => {

        this.colorGraph = value.color_grafico

        if (value.modo_grafico == null || value.modo_grafico == 'no') {
          this.graphClientOption = true
          this.obsApi.plotToolauto(dataToUse, sta, cha, unit_from, this.colorGraph, '', '', '', '', '', '', min, max).subscribe({
            next: value => {
              const indx = this.tabs.findIndex((tab: { label: string; }) => tab.label === `${sta}.${cha}`);
              if (indx !== -1) {

                this.tabs[indx].img = value.url

                this.cdRef.detectChanges();
              }
            },
            complete: () => {
              this.loadingBarGraph = false
            }
          })
        } else {
          this.graphClientOption = false
          this.obsApi.autoAdjust(dataToUse, sta, cha, unit_from, '', '', '', '', '', '', min, max, this.colorGraph).subscribe({
            next: value => {

              this.ToggleGraph = false
              this.loadingSpinnerData = true

              const indx = this.tabs.findIndex((tab: { label: string; }) => tab.label === `${sta}.${cha}`);

              if (indx !== -1) {

                const graph = this.graphGenerator(this.stationInfo, value, '(MODIFIED)', this.colorGraph)

                this.tabs[indx].graph = graph;

                // Manualmente activar la detección de cambios para la pestaña actualizada
                this.cdRef.detectChanges();
              }

            },
            error: err => {
              this.snackBar.open('No hay Datos para Renderizar', 'cerrar', snackBar)
              this.loadingSpinnerGraph = false
            },
            complete: () => {
              this.actApli.push(`AutoAjuste a ${sta}.${cha}`)

              this.loadingSpinnerData = false
              this.loadingBarGraph = false
              this.ToggleGraph = true
              this.toogleFilter = false
              this.isLoading = false
            }
          })
        }
      },
      error: err => {
        this.graphClientOption = true
        this.obsApi.plotToolauto(dataToUse, sta, cha, unit_from, this.colorGraph, '', '', '', '', '', '', min, max).subscribe({
          next: value => {
            const indx = this.tabs.findIndex((tab: { label: string; }) => tab.label === `${sta}.${cha}`);
            if (indx !== -1) {

              this.tabs[indx].img = value.url

              this.cdRef.detectChanges();
            }
          },
          complete: () => {
            this.loadingBarGraph = false
          }
        })
      },
    })

  }



  // -------------------------------------------------------------------------------------

  fourier(index: number) {
    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 3 * 1000;
    snackBar.panelClass = ['snackBar-validator'];

    const matDialogConfig = new MatDialogConfig()
    matDialogConfig.disableClose = true;

    let indexFilePanel = this.tabs[index].indexFilePanel || 0

    var dataString, dataFile = this.proyectData[indexFilePanel].urlconvert
    var unit_from: string = this.proyectData[indexFilePanel].unit

    let dataToUse: string = dataFile !== "null" ? dataFile : dataString !== "null" ? dataString : "";

    let sta = this.tabs[index].dataEst.station
    let cha = this.tabs[index].dataEst.channel
    let allData = this.tabs[index].dataEst

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

    let sendData = {
      "url": dataToUse,
      "station": sta,
      "channel": cha,
      "allData": allData,
      "t_min": min,
      "t_max": max
    }

    matDialogConfig.data = sendData

    this.matDialog.open(AmplitudFourierComponent, matDialogConfig)


  }

  espectFourier(index: number) {

    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 3 * 1000;
    snackBar.panelClass = ['snackBar-validator'];

    const matDialogConfig = new MatDialogConfig()
    matDialogConfig.disableClose = true;

    let indexFilePanel = this.tabs[index].indexFilePanel || 0

    var dataString, dataFile = this.proyectData[indexFilePanel].urlconvert
    var unit_from: string = this.proyectData[indexFilePanel].unit

    let dataToUse: string = dataFile !== "null" ? dataFile : dataString !== "null" ? dataString : "";

    let sta = this.tabs[index].dataEst.station
    let cha = this.tabs[index].dataEst.channel
    let allData = this.tabs[index].dataEst

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

    let sendData = {
      "url": dataToUse,
      "station": sta,
      "channel": cha,
      "allData": allData,
      "t_min": min,
      "t_max": max
    }

    matDialogConfig.data = sendData

    this.matDialog.open(EspectroFourierComponent, matDialogConfig)




  }

  // ------------------------------------------------------------------------------------- //




  // ! Generador de Graficos
  graphGenerator(e: any, value: any, dataformat: any, colorg?: string) {

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

    let peakA = value[0].peak_a || 0.00;
    let peakV = value[0].peak_v || 0.00;
    let peakD = value[0].peak_d || 0.00;

    let peakAFormated = this.decimalPipe.transform(peakA, '1.3-3');
    let peakVFormated = this.decimalPipe.transform(peakV, '1.3-3');
    let peakDFormated = this.decimalPipe.transform(peakD, '1.3-3');

    let peakaff;
    let peakvff;
    let peakdff;

    if (peakAFormated!.endsWith('.000')) {
      peakaff = this.decimalPipe.transform(peakA, '1.6-6');
    } else {
      peakaff = peakAFormated;
    }

    if (peakVFormated!.endsWith('.000')) {
      peakvff = this.decimalPipe.transform(peakV, '1.6-6');
    } else {
      peakvff = peakVFormated;
    }

    if (peakDFormated!.endsWith('.000')) {
      peakdff = this.decimalPipe.transform(peakD, '1.6-6');
    } else {
      peakdff = peakDFormated;
    }

    let fechaIn = this.dateConverter(e.starttime)
    let fechaFn = this.dateConverter(e.endtime)

    const accel = {
      color: [colorg],
      animationDuration: 5000,
      title: {
        text: `${dataformat} - Aceleracion | ${e.network}.${e.station}.${e.location}.${e.channel}`,
        subtext: `Inicio: ${fechaIn} || Fin: ${fechaFn} || Duracion: ${h}hrs. ${m}min. ${s}seg. ${ms}ms.`,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        triggerOn: 'click'
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
          },

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
            text: `PGA: ${peakaff} [${value[0].trace_a_unit}]`,
            font: '14px Microsoft YaHei'
          }
        }
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx: number) => idx * 5,
    };

    const vel = {
      color: [colorg],
      animationDuration: 5000,
      title: {
        text: `${dataformat} - Velocidad | ${e.network}.${e.station}.${e.location}.${e.channel}`,
        subtext: `Inicio: ${fechaIn} || Fin: ${fechaFn} || Duracion: ${h}hrs. ${m}min. ${s}seg. ${ms}ms.`,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        triggerOn: 'click'
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
            text: `PGV: ${peakvff} [${value[0].trace_v_unit}] `,
            font: '14px Microsoft YaHei'
          }
        }
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx: number) => idx * 5,
    };

    const dsp = {
      color: [colorg],
      animationDuration: 5000,
      title: {
        text: `${dataformat} - Desplazamiento | ${e.network}.${e.station}.${e.location}.${e.channel}`,
        subtext: `Inicio: ${fechaIn} || Fin: ${fechaFn} || Duracion: ${h}hrs. ${m}min. ${s}seg. ${ms}ms.`,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        triggerOn: 'click'
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
            text: `PGD: ${peakdff} [${value[0].trace_d_unit}]`,
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

  selectGroup(groupKey: string | any): void {
    this.selectedGroup = groupKey;
  }

  getGroupValues(group: any): any[] {
    return Object.values(group.value);
  }

  clearData() {
    localStorage.clear()

    this.urlFile = ''
    this.stringdata = ''

    this.proyectData = []
    this.tabs = []
    this.actApli = []

    this.groupedData = {}
  }

  // ? Toggle Panels o Bars
  deleteFile() {
    localStorage.clear()

    if (this.stopMseed != undefined) {
      this.stopMseed.unsubscribe()
    }

    this.urlFile = ''
    this.stringdata = ''

    this.proyectData = []
    this.tabs = []
    this.actApli = []
    this.stationInfo = []

    this.btnShow = false;
    this.btnCancel = true;
    this.btnDisable = false

    this.loadingSpinner = false
    this.loadingSpinnerStaInfo = false

    this.fileInput.nativeElement.value = ''

    this.groupedData = {}
    this.arch = ''
    this.controlForm.get('url').enable()
  }

  togglePanel() {
    if (this.hideStaPanel2 == true && this.hideStaPanel == true) {
      this.hideStaPanel = false
      this.hideStaPanel2 = false
    }
    else if (this.hideStaPanel == false && this.hideStaPanel2 == true) {
      this.hideStaPanel2 = false
    }
    else if (this.hideStaPanel2 == false) {
      this.hideStaPanel2 = true
    }
    else {
      this.hideStaPanel = false
      this.hideStaPanel2 = false
    }
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


  dateConverter(date: string) {

    const fechaHora = new Date(date);

    // const año = fechaHora.getFullYear();
    // const mes = ("0" + (fechaHora.getMonth() + 1)).slice(-2);
    // const dia = ("0" + fechaHora.getDate()).slice(-2);
    // const horas = ("0" + fechaHora.getHours()).slice(-2);
    // const minutos = ("0" + fechaHora.getMinutes()).slice(-2);
    // const segundos = ("0" + fechaHora.getSeconds()).slice(-2);

    // const formatoFechaHora = `${año}-${mes}-${dia} ${horas}:${minutos}:${segundos}`;
    const formatoFechaHora = fechaHora.toISOString().replace('T', ' ').replace(/\.\d+Z$/, '');

    return formatoFechaHora
  }

  showRegisterDialog(opcion: String) {

    const matDialogConfig = new MatDialogConfig()
    matDialogConfig.disableClose = true;
    matDialogConfig.data = opcion

    this.matDialog.open(RegisterDialogComponent, matDialogConfig)
  }

  resetGraph(tabInfo: any, index: number) {

    let indexFilePanel = this.tabs[index].indexFilePanel || 0

    var dataString, dataFile = this.proyectData[indexFilePanel].urlconvert
    var unit_from: string = this.proyectData[indexFilePanel].unit

    let dataToUse: string = dataFile !== "null" ? dataFile : dataString !== "null" ? dataString : "";

    this.isLoading = true
    this.loadingBarGraph = true

    this.auth.getToken().subscribe({
      next: value => {
        this.colorGraph = value.color_grafico

        if (value.modo_grafico == null || value.modo_grafico == 'no') {

          this.graphClientOption = true

          this.obsApi.plotGraph(dataToUse, tabInfo.dataEst.station, tabInfo.dataEst.channel, unit_from, this.colorGraph).subscribe({
            next: val => {
              const indx = this.tabs.findIndex((tab: { label: string; }) => tab.label === `${tabInfo.dataEst.station}.${tabInfo.dataEst.channel}`)
              if (indx !== -1) {
  
                this.tabs[indx].img = val.url
                this.tabs[indx].base = ''
                this.tabs[indx].unit = ''
  
                this.cdRef.detectChanges()
              }
            },
            error: err => {
              this.loadingBarGraph = false
            },
            complete: () => {
              this.loadingBarGraph = false
              this.loadingSpinnerGraph = false
              this.loadingBarGraph = false
              this.ToggleGraph = true
            }
  
          })

        } else {

          this.graphClientOption = false

          this.obsApi.getTraceData(dataToUse, tabInfo.dataEst.station, tabInfo.dataEst.channel, unit_from)
            .subscribe({
              next: value => {

                const indx = this.tabs.findIndex((tab: { label: string; }) => tab.label === `${tabInfo.dataEst.station}.${tabInfo.dataEst.channel}`)
                if (indx !== -1) {

                  const graph = this.graphGenerator(this.stationInfo, value, '(RAWDATA)', this.colorGraph)

                  this.tabs[indx].graph = graph
                  this.tabs[indx].base = ''
                  this.tabs[indx].unit = ''
                  this.cdRef.detectChanges()
                }
              },
              error: err => { this.isLoading = false, this.loadingBarGraph = false },
              complete: () => {
                this.loadingSpinnerGraph = false
                this.ToggleGraph = true
                this.isLoading = false
                this.loadingBarGraph = false
              }
            })

        }
      },
      error: err => {
        this.graphClientOption = true

        this.obsApi.plotGraph(dataToUse, tabInfo.dataEst.station, tabInfo.dataEst.channel, unit_from, this.colorGraph).subscribe({
          next: val => {
            const indx = this.tabs.findIndex((tab: { label: string; }) => tab.label === `${tabInfo.dataEst.station}.${tabInfo.dataEst.channel}`)
            if (indx !== -1) {

              this.tabs[indx].img = val.url
              this.tabs[indx].base = ''
              this.tabs[indx].unit = ''

              this.cdRef.detectChanges()
            }
          },
          error: err => {
            this.loadingBarGraph = false
          },
          complete: () => {
            this.loadingBarGraph = false
            this.loadingSpinnerGraph = false
            this.loadingBarGraph = false
            this.ToggleGraph = true
          }

        })

        // this.graphClientOption = true
        // this.loadingBarGraph = false
      },

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

  toggleButton() {
    this.isButtonActive = !this.isButtonActive;
    this.hideStaPanel = !this.hideStaPanel
  }

  sismosHistoricos() {

    const matDialogConfig = new MatDialogConfig()
    matDialogConfig.disableClose = true;

    this.matDialog.open(SismosHistoricosComponent, matDialogConfig).afterClosed().subscribe({
      next: value => {
        if (value.endpoint == '') {
          return
        } else {
          const url = `https://apiqs.ncn.pe/media/sismos_historicos/${value.endpoint}`
          this.controlForm.controls['url'].setValue(url)
          this.leerArchivo()
        }

      }
    })
  }

  donwloadData(tabInfo: any, m: string, index: number) {

    const snackBar = new MatSnackBarConfig();
    snackBar.panelClass = ['snackBar-validator'];

    let indexFilePanel = this.tabs[index].indexFilePanel || 0

    var dataString, dataFile = this.proyectData[indexFilePanel].urlconvert
    var unit_from: string = this.proyectData[indexFilePanel].unit

    let dataToUse: string = dataFile !== "null" ? dataFile : dataString !== "null" ? dataString : "";

    let net = tabInfo.dataEst.network
    let loc = tabInfo.dataEst.location
    let sta = tabInfo.dataEst.station
    let cha = tabInfo.dataEst.channel
    let base = tabInfo.base || ''
    let unit_to = tabInfo.unit || ''

    let type = tabInfo.FilterForm.get('type').value
    let fmin = tabInfo.FilterForm.get('freqmin').value
    let fmax = tabInfo.FilterForm.get('freqmax').value
    let corn = tabInfo.FilterForm.get('order').value
    let zero = tabInfo.FilterForm.get('zero').value

    const t_min = parseFloat(tabInfo.TrimForm.get('t_min').value);
    const t_max = parseFloat(tabInfo.TrimForm.get('t_max').value);

    let utc_min: any
    let utc_max: any

    let min = ''
    let max = ''

    if (isNaN(t_min) && isNaN(t_max)) {
      min = ''
      max = ''
    } else {
      utc_min = new Date(tabInfo.sttime);
      utc_max = new Date(tabInfo.sttime);

      utc_min.setUTCSeconds(utc_min.getUTCSeconds() + t_min);
      utc_max.setUTCSeconds(utc_max.getUTCSeconds() + t_max);

      min = utc_min.toISOString()
      max = utc_max.toISOString()
    }

    this.snackBar.open('⌛ Cargando ...', '', snackBar)

    this.obsApi.unitConvertion(dataToUse, sta, cha, base, type, fmin, fmax, corn, zero, min, max, unit_from, unit_to).subscribe({
      next: value => {
        this.proceseDataDownload(value, net, sta, loc, cha, m, tabInfo)
      },
      error: err => {
        this.snackBar.dismiss()
      },
      complete: () => {
        this.snackBar.dismiss()
        this.snackBar.open('✔️ Carga Completa', '', { panelClass: ['snackBar-validator'], duration: 2000 })
      }
    })
  }

  proceseDataDownload(value: any, net: string, sta: string, loc: string, cha: string, m: string, extrData: any) {
    let dataX = [];
    let dataY = [];

    let mag = '';
    let unidad = '';
    let type = '';
    let maxVal = '';

    let base = extrData.base || ''

    let typeFilter = extrData.FilterForm.get('type').value || ''
    let fmin = extrData.FilterForm.get('freqmin').value || ''
    let fmax = extrData.FilterForm.get('freqmax').value || ''
    let corn = extrData.FilterForm.get('order').value || ''
    let zero = extrData.FilterForm.get('zero').value || ''

    let t_min = parseFloat(extrData.TrimForm.get('t_min').value) || ''
    let t_max = parseFloat(extrData.TrimForm.get('t_max').value) || ''

    let title = 'QuakeSense | NCN Nuevo Control'
    let gentxt = 'Este archivo de texto fue generado por QuakeSense.'
    let mark = 'Descubre cómo nuestras soluciones avanzadas pueden proporcionar información \n crucial para el procesamiento sísmico y la seguridad estructural.'
    let contact = 'Contacto: informes@ncn.pe'
    let web = 'Website: https://qs.ncn.pe'

    const samples = extrData.dataEst.sampling_rate
    const npts = extrData.dataEst.npts

    if (m == 'acel' || m == 'vel' || m == 'des') {
      dataX = value[0].tiempo_a;
      if (m == 'acel') {
        dataY = value[0].traces_a;
        type = 'ACEL';
        mag = 'ACELERACION';
        unidad = value[0].trace_a_unit;
        maxVal = 'PGA: ' + value[0].peak_a.toFixed(6);

      } else if (m == 'vel') {
        dataY = value[0].traces_v;
        type = 'VEL';
        mag = 'VELOCIDAD';
        unidad = value[0].trace_v_unit;
        maxVal = 'PGV: ' + value[0].peak_v.toFixed(6);
      } else if (m == 'des') {
        dataY = value[0].traces_d;
        type = 'DESP';
        mag = 'DESPLAZAMIENTO';
        unidad = value[0].trace_d_unit;
        maxVal = 'PGD: ' + value[0].peak_d.toFixed(6);
      }
    } else if (m == 'all') {
      dataX = value[0].tiempo_a;
      dataY = value[0].traces_a;
      const data2Y = value[0].traces_v;
      const data3Y = value[0].traces_d;
      const und1 = value[0].trace_a_unit;
      const und2 = value[0].trace_v_unit;
      const und3 = value[0].trace_d_unit;
      const maxV1 = value[0].peak_a.toFixed(6);
      const maxV2 = value[0].peak_v.toFixed(6);
      const maxV3 = value[0].peak_d.toFixed(6);

      let dataText = '';
      dataText += title + '\n'
      dataText += gentxt + '\n'
      dataText += mark + '\n'
      dataText += contact + '\n'
      dataText += web + '\n \n'
      dataText += '1. INFORMACION' + '\n'
      dataText += `    NETWORK        : ${net}` + '\n'
      dataText += `    ESTACION       : ${sta}` + '\n'
      dataText += `    LOCACION       : ${loc}` + '\n'
      dataText += `    CANAL          : ${cha}` + '\n'
      dataText += `    NRO. DATOS     : ${npts}` + '\n'
      dataText += `    FRECUENCIA     : ${samples} Hz` + '\n\n'
      dataText += '2. UNIDADES' + '\n'
      dataText += '    TIEMPO         : Segundos [s]' + '\n'
      dataText += `    ACELERACION    : [${und1}]` + '\n'
      dataText += `    VELOCIDAD      : [${und2}]` + '\n'
      dataText += `    DESPLAZAMIENTO : [${und3}]` + '\n\n'
      dataText += '4. HERRAMIENTAS USADAS' + '\n'
      dataText += `    4.1 CORRECCION DE LINEA BASE ` + '\n'
      dataText += `        BASE        : ${base}` + '\n'
      dataText += `    4.2 FILTRO      ` + '\n'
      dataText += `        TIPO        : ${typeFilter}` + '\n'
      dataText += `        FREQ. MIN.  : ${fmin}` + '\n'
      dataText += `        FREQ. MAX.  : ${fmax}` + '\n'
      dataText += `        CORNERS     : ${corn}` + '\n'
      dataText += `        BILINEAR    : ${zero}` + '\n'
      dataText += `    4.3 RECORTE [segundos] ` + '\n'
      dataText += `        MIN        : ${t_min}` + '\n'
      dataText += `        MAX        : ${t_max}` + '\n\n'
      dataText += '3. VALORES MAXIMOS' + '\n'
      dataText += `    PGA            : ${maxV1} [${und1}]` + '\n'
      dataText += `    PGV            : ${maxV2} [${und2}]` + '\n'
      dataText += `    PGD            : ${maxV3} [${und3}]` + '\n\n'
      dataText += '4. DATOS DE LA ACELERACION Y COMPONENTES' + '\n\n'
      for (let i = 0; i < dataX.length; i++) {
        dataText += dataX[i].toFixed(3).padStart(12) + '     ' + dataY[i].toFixed(8).padStart(12) + '     ' + data2Y[i].toFixed(8).padStart(12) + '     ' + data3Y[i].toFixed(8).padStart(12) + '\n';
      }

      const downloadLink = document.createElement('a');
      downloadLink.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(dataText);
      downloadLink.download = `DATA_ALL__${net}.${sta}.${loc}.${cha}.txt`;

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      return;
    } else {
      dataX = [];
      dataY = [];
      type = '';
      m = '';
      unidad = '';
    }

    if (dataX.length > 0 && dataY.length > 0) {
      let dataText = '';
      dataText += title + '\n'
      dataText += gentxt + '\n'
      dataText += mark + '\n'
      dataText += contact + '\n'
      dataText += web + '\n'
      dataText += '\n'
      dataText += '1. INFORMACION DE LA ESTACION' + '\n'
      dataText += `    NETWORK        : ${net}` + '\n'
      dataText += `    ESTACION       : ${sta}` + '\n'
      dataText += `    LOCACION       : ${loc}` + '\n'
      dataText += `    CANAL          : ${cha}` + '\n'
      dataText += `    NRO. DATOS     : ${npts}` + '\n'
      dataText += `    FRECUENCIA     : ${samples} Hz` + '\n'
      dataText += '\n'
      dataText += '2. UNIDADES' + '\n'
      dataText += '    TIEMPO         : Segundos [s]' + '\n'
      dataText += `    ${mag}         : [${unidad}]` + '\n'
      dataText += '\n'
      dataText += '3. VALORES MAXIMOS' + '\n'
      dataText += `    ${maxVal}      : [${unidad}]` + '\n\n'
      dataText += '4. HERRAMIENTAS USADAS' + '\n'
      dataText += `    4.1 CORRECCION DE LINEA BASE ` + '\n'
      dataText += `        BASE        : ${base}` + '\n'
      dataText += `    4.2 FILTRO      ` + '\n'
      dataText += `        TIPO        : ${typeFilter}` + '\n'
      dataText += `        FREQ. MIN.  : ${fmin}` + '\n'
      dataText += `        FREQ. MAX.  : ${fmax}` + '\n'
      dataText += `        CORNERS     : ${corn}` + '\n'
      dataText += `        BILINEAR    : ${zero}` + '\n'
      dataText += `    4.3 RECORTE [segundos] ` + '\n'
      dataText += `        MIN        : ${t_min}` + '\n'
      dataText += `        MAX        : ${t_max}` + '\n\n'
      dataText += '5. DATOS DE LA ACELERACION' + '\n'
      dataText += '    T' + '     ' + `${cha}` + '\n'

      for (let i = 0; i < dataX.length; i++) {
        dataText += dataX[i].toFixed(3).padStart(12) + '     ' + dataY[i].toFixed(8).padStart(12) + '\n';
      }

      const downloadLink = document.createElement('a');
      downloadLink.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(dataText);
      downloadLink.download = `DATA_${type}__${net}.${sta}.${loc}.${cha}.txt`;

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  }

  savePorgressProyect() {
    console.log('Proyecto Data', this.proyectData);
    console.log('Info Tabs', this.tabs)
    // let uuid = this.proyectData[0].uuid
    // let tabInfo = this.tabs
    // this.obsUser.putProjectTab(uuid, tabInfo).subscribe({
    //   error: err => {
    //   },
    //   complete: () => {
    //   }
    // })

  }

  redirectAcel() {
    window.open('https://ncn.pe/acelerografo-reftek-sma2')
  }

}
