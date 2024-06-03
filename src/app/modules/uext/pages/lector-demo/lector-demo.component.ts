import { trigger, transition, style, animate } from '@angular/animations';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatTab, MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { EChartsOption } from 'echarts';
import { ObspyAPIService } from 'src/app/service/obspy-api.service';
import { ArchivoTXTComponent } from '../../componentes/archivo-txt/archivo-txt.component';
import { ArchivoMseedComponent } from '../../componentes/archivo-mseed/archivo-mseed.component';
import { RegisterDialogComponent } from '../../componentes/register-dialog/register-dialog.component';
import { DecimalPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { CustomEvent, ImageViewerComponent, ImageViewerConfig } from 'ngx-image-viewer';
import { HttpClient } from '@angular/common/http';
import { SismosHistoricosComponent } from '../../componentes/sismos-historicos/sismos-historicos.component';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { ActivatedRoute, Router } from '@angular/router';

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
    trigger('aparecer', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 })),
      ]),
    ]),
  ],
  templateUrl: './lector-demo.component.html',
  styleUrls: ['./lector-demo.component.css']
})
export class LectorDemoComponent implements OnInit {

  url: string = ''

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
  private userInfo = ''

  loadingSpinner = false
  loadingSpinnerStaInfo = false
  loadingBarGraph = false
  loadingSpinnerGraph = false
  loadingSpinnerData = false
  isLoading = false

  ToggleGraph = false
  toggleTabs = false

  btnShow = false
  btnCancel = true
  btnDisable = false
  zoomActivate = false
  isButtonActive = false

  hideStaPanel = true
  hideStaPanel2 = true
  showResponsivebar = false

  urlFile = ''
  idFile = ''
  original_unit = ''
  stringdata = ''
  formatFile = ''

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

  proyectData: any[] = []

  headerText = {
    title: "(DEMO) - Lector de Archivos Acelerográficos",
    preSub: "Podras manipular archivos de diferentes",
    redirect: "acelerografos",
    sufSub: "y aplicar las diferentes herramientas que ofrecemos",

  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private obsApi: ObspyAPIService,
    private snackBar: MatSnackBar,
    private cdRef: ChangeDetectorRef,
    private matDialog: MatDialog,
    private decimalPipe: DecimalPipe,
    private router: Router,
    //TODO: Habilitar para usar captcha
    //private recaptchaV3Service: ReCaptchaV3Service,
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

    // ----------- NO BORRAR -----------------------

    // ----------- NO BORRAR -----------------------

    this.obsApi.getIpAddress().subscribe({
      next: value => {
        this.userInfo = value.ip
      }
    })

    this.controlForm = new FormGroup({
      url: new FormControl(''),
    })

    this.activatedRoute.paramMap.subscribe({
      next: value => {
        if (value.get('url')! == '' || value.get('url')! == null || value.get('url')! == undefined) {
          console.log(value.get('url'));
          this.router.navigateByUrl('/lectorDemo/demo')
        } else {
          const decodeUrl = atob(atob(value.get('url')!))
          console.log(decodeUrl);

          if (this.esURL(decodeUrl)) {
            this.headerText = {
              title: "(VISTA) - Lector de Archivos Acelerográficos",
              preSub: "Estas viendo la vista de un",
              redirect: "acelerografo,",
              sufSub: " puedes aplicar algunas funcionalidades",

            }
            this.url = decodeUrl
            this.controlForm.controls['url'].setValue(this.url)
            this.leerArchivo()
          }
        }
      }
    })
  }

  esURL(url: string): boolean {
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlRegex.test(url);
  }

  // ! Manipulacion de Archivos 

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
              this.proyectData.push({
                "originalName": na,
                "urlconvert": value.url,
                "format": '',
                "unit": ''
              })

              this.leerTxt(value.url)
            },
            error: err => {
              this.snackBar.open('⚠️Error al Leer Archivo', 'cerrar', snackBar)
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

        this.obsApi.uploadFile(valorNoVacio, this.userInfo).subscribe({
          next: value => {

            this.proyectData.push({
              "originalName": na,
              "urlconvert": value.file || value.string_data,
              "format": value.f,
              "unit": ''
            })

            // localStorage.setItem('urlFileUpload', value.file)
            // localStorage.setItem('urlSearched', value.string_data)
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

            // let url = ''
            let url = this.proyectData[0].urlconvert

            // if (localStorage.getItem('urlFileUpload')! == null || localStorage.getItem('urlFileUpload')! == 'null') {
            //   url = localStorage.getItem('urlSearched')!
            // } else if (localStorage.getItem('urlSearched')! == null || localStorage.getItem('urlSearched')! == 'null') {
            //   url = localStorage.getItem('urlFileUpload')!
            // }

            if (ext == 'txt' || this.formatFile == 'TXT' || this.proyectData[0].format == 'TXT') {
              this.leerTxt(url)
            } else if (this.proyectData[0].format == 'MSEED' || this.formatFile == 'MSEED' || ext == 'mseed') {
              this.leerMseed(url)
            } else {
              this.obsApi.getData(url).subscribe({
                next: value => {

                  if (value.data[0].und_calib == 'M/S**2') {
                    this.proyectData[0].unit = 'm'
                    // localStorage.setItem('ogUnit', 'm')
                  } else if (value.data[0].und_calib == 'CM/S**2' || ext == 'evt' || this.formatFile == 'REFTEK130') {
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

                  this.leer(value.data[0])
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
                  this.btnDisable = false
                }
              })
            }
          }
        })

        //TODO: AGREGAR CAPTCHA

        // this.recaptchaV3Service.execute('archivo_subido').subscribe({
        //   next: value => {
        //     console.log(value);

        //   },
        //   error: err => {
        //     console.log(err);

        //   },
        //   complete: () => {



        //   }
        // })

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



  leerArchivoTest() {

    this.clearData()

    this.btnDisable = true

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

      if (this.urlFile == '' && this.stringdata == '') {

        let valorNoVacio_recived: any = archivoValue.name
        let nombreArchivo: string = valorNoVacio_recived.substring(valorNoVacio_recived.lastIndexOf('/') + 1);
        let extension: string = nombreArchivo.substring(nombreArchivo.lastIndexOf('.') + 1);

        try {

          if (extension == 'XMR') {
            this.stopXmr = this.obsApi.covertionXMR(archivoValue).subscribe({
              next: value => {
                this.leerTxt(value.url)
              },
              error: err => {
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

        } catch (error) {

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
              this.btnDisable = false
              this.snackBar.open('⚠️ Fuera de Linea', 'cerrar', snackBar)
            },
            complete: () => {
              let valorNoVacio_recived: any = this.urlFile || this.stringdata
              let nombreArchivo: string = valorNoVacio_recived.substring(valorNoVacio_recived.lastIndexOf('/') + 1);
              let extension: string = nombreArchivo.substring(nombreArchivo.lastIndexOf('.') + 1);

              if (this.urlFile == null) {

                if (extension == 'txt') {

                  this.leerTxt(valorNoVacio_recived)

                } else if (extension == 'mseed' || extension == 'msd') {

                  this.leerMseed(valorNoVacio_recived)

                } else {

                  this.obsApi.getData(this.stringdata).subscribe({
                    next: value => {

                      if (value.data[0].und_calib == 'M/S**2') {
                        localStorage.setItem('ogUnit', 'm')
                      } else if (value.data[0].und_calib == 'CM/S**2' || extension == 'evt' || value.data[0].format == 'REFTEK130') {
                        localStorage.setItem('ogUnit', 'gal')
                      } else if (value.data[0].und_calib == 'G') {
                        localStorage.setItem('ogUnit', 'g')
                      } else {
                        localStorage.setItem('ogUnit', '')
                      }

                      this.groupedData = this.groupByNetworkAndStation(value.data, value.inv)

                      this.leer(value.data[0])
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
                      this.btnDisable = false
                    }
                  })

                }

              } else if (this.stringdata == null) {

                if (extension == 'txt') {

                  this.leerTxt(valorNoVacio_recived)

                } else if (extension == 'mseed' || extension == 'msd') {

                  this.leerMseed(valorNoVacio_recived)

                } else {

                  this.obsApi.getData(this.urlFile).subscribe({
                    next: value => {

                      if (value.data[0].und_calib == 'M/S**2') {
                        localStorage.setItem('ogUnit', 'm')
                      } else if (value.data[0].und_calib == 'CM/S**2' || extension == 'evt' || value.data[0].format == 'REFTEK130') {
                        localStorage.setItem('ogUnit', 'gal')
                      } else if (value.data[0].und_calib == 'G') {
                        localStorage.setItem('ogUnit', 'g')
                      } else {
                        localStorage.setItem('ogUnit', '')
                      }
                      this.toggleTabs = true
                      this.groupedData = this.groupByNetworkAndStation(value.data, value.inv)
                      this.leer(value.data[0])
                    },
                    error: err => {
                      this.snackBar.open('Formato no Soportado', 'cerrar', snackBar)
                      this.loadingSpinner = false
                      this.loadingSpinnerStaInfo = false
                      this.btnDisable = false
                    },
                    complete: () => {
                      this.loadingSpinner = false
                      this.loadingSpinnerStaInfo =
                        this.btnDisable = false
                    }
                  })

                }

              } else {
                this.snackBar.open('No se puede leer Datos', 'cerrar', snackBar)
                this.loadingSpinner = false
                this.loadingSpinnerStaInfo = false
                this.btnDisable = false
              }
            }
          })
        }

      } else {

        let valorNoVacio_recived: any = this.urlFile || this.stringdata

        let nombreArchivo: string = valorNoVacio_recived.substring(valorNoVacio_recived.lastIndexOf('/') + 1)

        let extension: string = nombreArchivo.substring(nombreArchivo.lastIndexOf('.') + 1)

        if (this.urlFile == null || '') {

          if (extension == 'txt') {

            this.leerTxt(valorNoVacio_recived)

          } else if (extension == 'mseed' || extension == 'msd') {

            this.leerMseed(valorNoVacio_recived)

          } else {

            this.obsApi.getData(this.stringdata).subscribe({
              next: value => {

                if (value.data[0].und_calib == 'M/S**2') {
                  localStorage.setItem('ogUnit', 'm')
                } else if (value.data[0].und_calib == 'CM/S**2' || extension == 'evt' || value.data[0].format == 'REFTEK130') {
                  localStorage.setItem('ogUnit', 'gal')
                } else if (value.data[0].und_calib == 'G') {
                  localStorage.setItem('ogUnit', 'g')
                } else {
                  localStorage.setItem('ogUnit', '')
                }

                this.groupedData = this.groupByNetworkAndStation(value.data, value.inv)
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
                this.btnDisable = false
              }
            })

          }

        } else if (this.stringdata == null || '') {

          if (extension == 'txt') {

            this.leerTxt(valorNoVacio_recived)

          } else if (extension == 'mseed' || extension == 'msd') {

            this.leerMseed(valorNoVacio_recived)

          } else {

            this.obsApi.getData(this.urlFile).subscribe({
              next: value => {

                if (value.data[0].und_calib == 'M/S**2') {
                  localStorage.setItem('ogUnit', 'm')
                } else if (value.data[0].und_calib == 'CM/S**2' || extension == 'evt' || value.data[0].format == 'REFTEK130') {
                  localStorage.setItem('ogUnit', 'gal')
                } else if (value.data[0].und_calib == 'G') {
                  localStorage.setItem('ogUnit', 'g')
                } else {
                  localStorage.setItem('ogUnit', '')
                }

                this.toggleTabs = true
                this.groupedData = this.groupByNetworkAndStation(value.data, value.inv)
                this.leer(value.data[0])
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
                this.btnDisable = false
              }
            })

          }

        } else {
          this.snackBar.open('No se puede leer Datos', 'cerrar', snackBar)
          this.loadingSpinner = false
          this.loadingSpinnerStaInfo = false
          this.btnDisable = false
        }
      }

    } else {
      this.snackBar.open('No se encontro ARCHIVO o URL', 'cerrar', snackBar)
      this.loadingSpinner = false
      this.loadingSpinnerStaInfo = false
      this.btnDisable = false
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

    this.matDialog.open(ArchivoTXTComponent, matDialogConfig).afterClosed()
      .subscribe({
        next: value => {

          // this.toggleTabs = true

          if (value.url == '') {

            this.proyectData = []
            this.loadingSpinner = false
            this.loadingSpinnerStaInfo = false
            this.btnDisable = false
            this.router.navigateByUrl('/lectorDemo/demo')
            return

          } else {

            this.proyectData[0].urlconvert = value.url
            this.proyectData[0].unit = value.unit

            // this.urlFile = value.url
            // this.original_unit = value.unit

            // localStorage.setItem('urlFileUpload', value.url)
            // localStorage.setItem('ogUnit', value.unit)

            this.stopTxt = this.obsApi.getData(this.proyectData[0].urlconvert).subscribe({
              next: value => {
                this.toggleTabs = true

                this.groupedData = this.groupByNetworkAndStation(value.data, value.inv)
                this.proyectData[0].stations = this.groupedData

                this.leer(value.data[0])
              },
              error: err => {
                this.snackBar.open('⚠️ Error CTS-DT', 'cerrar', snackBar)
                this.loadingSpinner = false
                this.loadingSpinnerStaInfo = false
                this.btnDisable = false
                this.router.navigateByUrl('/lectorDemo/demo')
              },
              complete: () => {
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
          this.router.navigateByUrl('/lectorDemo/demo')
        },
        complete: () => {
          this.loadingSpinner = false
          this.loadingSpinnerStaInfo = false
          this.btnDisable = false
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

            this.proyectData = []
            this.loadingSpinner = false
            this.loadingSpinnerStaInfo = false
            this.btnDisable = false
            return

          } else {

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
              },
              error: err => {
                this.snackBar.open('⚠️ Error al leer el XML', 'cerrar', snackBar)
                this.loadingSpinner = false
                this.loadingSpinnerStaInfo = false
                this.btnDisable = false
              },
              complete: () => {
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
        },
        complete: () => {
          this.loadingSpinner = false
        }
      }

      )

  }

  leer(e: any, indexFile?: number) {

    for (const elem of this.tabs) {
      if (elem.label == `${e.station}.${e.channel}`) {
        alert('Ya hay una pestaña con esa estacion')
        return
      }
    }

    this.loadingSpinnerGraph = true
    this.loadingBarGraph = true
    this.ToggleGraph = false
    this.toggleTabs = false

    this.stationInfo = e

    var dataFile = this.proyectData[indexFile || 0].urlconvert;
    var dataString = dataFile;
    var og_unit: string = this.proyectData[indexFile || 0].unit

    // var dataString: string = localStorage.getItem('urlSearched')!
    // var dataFile: string = localStorage.getItem('urlFileUpload')!

    //var og_unit: string = localStorage.getItem('ogUnit')!

    let dataToUse: string = dataFile !== "null" ? dataFile : dataString !== "null" ? dataString : "";

    // this.obsApi.getTraceData(dataToUse, e.station, e.channel, og_unit).subscribe({
    //   next: value => { this.createTab(e, value , '') },
    //   error: err => console.error('REQUEST API ERROR: ' + err.message),
    //   complete: () => {
    //     this.loadingSpinnerGraph = false
    //     this.ToggleGraph = true
    //   }
    // })

    this.obsApi.plotGraph(dataToUse, e.station, e.channel, og_unit).subscribe({
      next: val => {
        if (!val.url) {
          this.createTab(e, val, '', indexFile)
        } else {
          this.createTab(e, val, val.url, indexFile)
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
  }

  // ! Creacion de Tabs

  createTab(e: any, value: any, img: string, indexFilePanel?: number): void {
    this.ToggleGraph = false;

    // const graph = this.graphGenerator(e, value, '(RAWDATA)');

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
      indexFilePanel: indexFilePanel,
      // graph,
      img
    });

    this.lastIndexTab = this.tabs.length - 1

    this.ToggleGraph = true;

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
      },
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

    var dataFile = this.proyectData[indexFilePanel].urlconvert
    var dataString = dataFile
    var unit_from: string = this.proyectData[indexFilePanel].unit

    // let dataString: string = localStorage.getItem('urlSearched')!
    // let dataFile: string = localStorage.getItem('urlFileUpload')!
    // let unit_from = localStorage.getItem('ogUnit')!

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

    this.obsApi.plotToolGraph(dataToUse, sta, cha, base, type, fmin, fmax, corn, zero, min, max, unit_from, unit).subscribe({
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

    // this.obsApi.getTraceDataBaseLine(dataToUse, sta, cha, base, type, fmin, fmax, corn, zero, min, max, unit_from, unit).subscribe({
    //   next: value => {

    //     this.ToggleGraph = false

    //     const indx = this.tabs.findIndex((tab: { label: string; }) => tab.label === `${sta}.${cha}`);

    //     if (indx !== -1) {

    //       const graph = this.graphGenerator(this.stationInfo, value, '(MODIFIED)')

    //       this.tabs[indx].graph = graph;
    //       this.tabs[indx].base = base

    //       this.cdRef.detectChanges();
    //     }


    //   },
    //   error: err => {
    //     this.snackBar.open('No hay Datos para Renderizar', 'cerrar', snackBar)
    //     this.loadingSpinnerGraph = false
    //     console.error('REQUEST API ERROR: ' + err.message)
    //   },
    //   complete: () => {
    //     this.actApli.push(`Linea Base: ${base} a ${sta}.${cha}`)
    //     this.loadingSpinnerData = false

    //     this.ToggleGraph = true
    //     this.isLoading = false
    //   }
    // })
  }

  filter(index: number) {

    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 3 * 1000;
    snackBar.panelClass = ['snackBar-validator'];

    let indexFilePanel = this.tabs[index].indexFilePanel || 0

    var dataFile = this.proyectData[indexFilePanel].urlconvert
    var dataString = dataFile
    var unit_from: string = this.proyectData[indexFilePanel].unit

    // var dataString: string = localStorage.getItem('urlSearched')!
    // var dataFile: string = localStorage.getItem('urlFileUpload')!
    // let unit_from = localStorage.getItem('ogUnit')!

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

    this.obsApi.plotToolGraph(dataToUse, sta, cha, base, type, fmin, fmax, corn, zero, min, max, unit_from, unit).subscribe({

      next: value => {
        const indx = this.tabs.findIndex((tab: { label: string; }) => tab.label === `${sta}.${cha}`);

        if (indx !== -1) {
          this.tabs[indx].img = value.url
          this.cdRef.detectChanges();
        }
      },
      complete: () => {
        this.loadingBarGraph = false
        this.toogleFilter = false
      }
    })

    // this.obsApi.getTraceDataFilter(dataToUse, sta, cha, base, type, fmin, fmax, corn, zero, min, max, unit_from, unit).subscribe({
    //   next: value => {

    //     this.ToggleGraph = false
    //     this.loadingSpinnerData = true

    //     const indx = this.tabs.findIndex((tab: { label: string; }) => tab.label === `${sta}.${cha}`);

    //     if (indx !== -1) {

    //       const graph = this.graphGenerator(this.stationInfo, value, '(MODIFIED)')

    //       this.tabs[indx].graph = graph;

    //       // Manualmente activar la detección de cambios para la pestaña actualizada
    //       this.cdRef.detectChanges();
    //     }

    //   },
    //   error: err => {
    //     this.snackBar.open('No hay Datos para Renderizar', 'cerrar', snackBar)
    //     this.loadingSpinnerGraph = false
    //     this.loadingBarGraph = false
    //     console.error('REQUEST API ERROR: ' + err.message)
    //   },
    //   complete: () => {
    //     this.actApli.push(`Filtro: ${type} a ${sta}.${cha}`)

    //     this.loadingSpinnerData = false
    //     this.ToggleGraph = true
    //     this.toogleFilter = false
    //     this.isLoading = false
    //   }
    // })
  }

  trim(index: number) {

    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 3 * 1000;
    snackBar.panelClass = ['snackBar-validator'];

    let indexFilePanel = this.tabs[index].indexFilePanel || 0

    var dataFile = this.proyectData[indexFilePanel].urlconvert
    var dataString = dataFile
    var unit_from: string = this.proyectData[indexFilePanel].unit

    // var dataString: string = localStorage.getItem('urlSearched')!
    // var dataFile: string = localStorage.getItem('urlFileUpload')!
    // let unit_from = localStorage.getItem('ogUnit')!

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

    this.obsApi.plotToolGraph(dataToUse, sta, cha, base, type, fmin, fmax, corn, zero, min, max, unit_from, unit).subscribe({
      next: value => {
        const indx = this.tabs.findIndex((tab: { label: string; }) => tab.label === `${sta}.${cha}`);
        if (indx !== -1) {

          this.tabs[indx].img = value.url
          this.cdRef.detectChanges();
        }
      },
      complete: () => {
        this.loadingBarGraph = false
        this.toogleTrim = false
      }
    })

    // this.obsApi.getTraceDataTrim(dataToUse, sta, cha, base, type, fmin, fmax, corn, zero, min, max, unit_from, unit).subscribe({
    //   next: value => {

    //     this.ToggleGraph = false
    //     this.loadingSpinnerData = true

    //     // const indx = this.tabs.findIndex((tab: { index: number; }) => tab.index === index)
    //     const indx = this.tabs.findIndex((tab: { label: string; }) => tab.label === `${sta}.${cha}`);

    //     if (indx !== -1) {

    //       const graph = this.graphGenerator(this.stationInfo, value, '(MODIFIED)')

    //       this.tabs[indx].graph = graph;

    //       this.cdRef.detectChanges();
    //     }

    //   },
    //   error: err => {
    //     this.snackBar.open('No hay Datos para Renderizar', 'cerrar', snackBar)
    //     this.loadingSpinnerGraph = false
    //     this.loadingBarGraph = false
    //     console.error('REQUEST API ERROR: ' + err.message)
    //   },
    //   complete: () => {
    //     this.actApli.push(`Trim: ${t_max - t_min}seg a ${sta}.${cha}`)

    //     this.loadingSpinnerData = false

    //     this.ToggleGraph = true

    //     this.isLoading = false

    //     this.toogleFilter = false
    //   }
    // })
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
      'mg': 'mg',
      'unk': ''
    };

    let unit_to = this.unitConvertOptions[menuIndex];
    unit_to = unitMap[unit_to] || '';

    let indexFilePanel = this.tabs[index].indexFilePanel || 0

    var dataFile = this.proyectData[indexFilePanel].urlconvert
    var dataString = dataFile
    var unit_from: string = this.proyectData[indexFilePanel].unit

    // let unit_from = localStorage.getItem('ogUnit')!

    // var dataString: string = localStorage.getItem('urlSearched')!
    // var dataFile: string = localStorage.getItem('urlFileUpload')!

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

    this.obsApi.plotToolGraph(dataToUse, sta, cha, base, type, fmin, fmax, corn, zero, min, max, unit_from, unit_to).subscribe({
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

    // this.obsApi.unitConvertion(dataToUse, sta, cha, base, type, fmin, fmax, corn, zero, min, max, unit_from, unit_to).subscribe({
    //   next: value => {

    //     this.ToggleGraph = false


    //     const indx = this.tabs.findIndex((tab: { label: string; }) => tab.label === `${sta}.${cha}`);

    //     if (indx !== -1) {

    //       const graph = this.graphGenerator(this.stationInfo, value, '(MODIFIED)')

    //       this.obsApi.plotToolGraph(dataToUse, sta, cha, base, type, fmin, fmax, corn, zero, min, max, unit_from, unit_to).subscribe({
    //         next: val => {
    //           this.tabs[indx].img = val.url
    //         },
    //         complete: () =>{
    //           this.loadingBarGraph = false
    //         }
    //       })

    //       this.tabs[indx].graph = graph;
    //       this.tabs[indx].unit = unit_to

    //       this.cdRef.detectChanges();
    //     }


    //   },
    //   error: err => {
    //     this.snackBar.open('No hay Datos para Renderizar', 'cerrar', snackBar)
    //     this.loadingSpinnerGraph = false
    //     this.loadingBarGraph = false
    //     console.error('REQUEST API ERROR: ' + err.message)
    //   },
    //   complete: () => {
    //     this.actApli.push(`Linea Base: ${base} a ${sta}.${cha}`)
    //     this.loadingSpinnerData = false

    //     this.ToggleGraph = true
    //     this.isLoading = false
    //   }
    // })
  }

  autoAjuste(index: number) {

    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 3 * 1000;
    snackBar.panelClass = ['snackBar-validator'];

    let indexFilePanel = this.tabs[index].indexFilePanel || 0

    var dataFile = this.proyectData[indexFilePanel].urlconvert
    var dataString = dataFile
    var unit_from: string = this.proyectData[indexFilePanel].unit

    // var dataString: string = localStorage.getItem('urlSearched')!
    // var dataFile: string = localStorage.getItem('urlFileUpload')!
    // let unit_from = localStorage.getItem('ogUnit')!

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

    this.obsApi.plotToolauto(dataToUse, sta, cha, unit_from, '', '', '', '', '', '', '', min, max).subscribe({
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

    // this.obsApi.autoAdjust(dataToUse, sta, cha, unit_from).subscribe({
    //   next: value => {

    //     this.ToggleGraph = false
    //     this.loadingSpinnerData = true

    //     const indx = this.tabs.findIndex((tab: { label: string; }) => tab.label === `${sta}.${cha}`);

    //     if (indx !== -1) {

    //       const graph = this.graphGenerator(this.stationInfo, value, '(MODIFIED)')

    //       this.obsApi.plotToolauto(dataToUse, sta, cha, unit_from).subscribe({
    //         next: val => {
    //           this.tabs[indx].img = val.url
    //         },
    //         complete: () =>{
    //           this.loadingBarGraph = false
    //         }
    //       })

    //       this.tabs[indx].graph = graph;

    //       // Manualmente activar la detección de cambios para la pestaña actualizada
    //       this.cdRef.detectChanges();
    //     }

    //   },
    //   error: err => {
    //     this.snackBar.open('No hay Datos para Renderizar', 'cerrar', snackBar)
    //     this.loadingSpinnerGraph = false
    //     this.loadingBarGraph = false
    //     console.error('REQUEST API ERROR: ' + err.message)
    //   },
    //   complete: () => {
    //     this.actApli.push(`AutoAjuste a ${sta}.${cha}`)

    //     this.loadingSpinnerData = false
    //     this.ToggleGraph = true
    //     this.toogleFilter = false
    //     this.isLoading = false
    //   }
    // })
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

  selectGroup(groupKey: string): void {
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
    matDialogConfig.data = opcion

    this.matDialog.open(RegisterDialogComponent, matDialogConfig)
  }

  resetGraph(tabInfo: any, index: number) {

    let indexFilePanel = this.tabs[index].indexFilePanel || 0

    var dataFile = this.proyectData[indexFilePanel].urlconvert
    var dataString = dataFile
    var unit_from: string = this.proyectData[indexFilePanel].unit

    // var dataString: string = localStorage.getItem('urlSearched')!
    // var dataFile: string = localStorage.getItem('urlFileUpload')!
    // let unit_from = localStorage.getItem('ogUnit')!

    let dataToUse: string = dataFile !== "null" ? dataFile : dataString !== "null" ? dataString : "";

    this.isLoading = true
    this.loadingBarGraph = true

    this.obsApi.plotGraph(dataToUse, tabInfo.dataEst.station, tabInfo.dataEst.channel, unit_from).subscribe({
      next: value => {
        const indx = this.tabs.findIndex((tab: { label: string; }) => tab.label === `${tabInfo.dataEst.station}.${tabInfo.dataEst.channel}`)
        if (indx !== -1) {

          this.tabs[indx].img = value.url
          this.tabs[indx].base = ''
          this.tabs[indx].unit = ''

          this.cdRef.detectChanges()
        }
      },
      complete: () => {
        this.loadingSpinnerGraph = false
        this.loadingBarGraph = false
        this.ToggleGraph = true
      }

    })

    // this.obsApi.getTraceData(dataToUse, tabInfo.dataEst.station, tabInfo.dataEst.channel, unit_from).subscribe({
    //   next: value => {

    //     const indx = this.tabs.findIndex((tab: { label: string; }) => tab.label === `${tabInfo.dataEst.station}.${tabInfo.dataEst.channel}`)
    //     if (indx !== -1) {

    //       const graph = this.graphGenerator(this.stationInfo, value, '(RAWDATA)')

    //       this.tabs[indx].graph = graph
    //       this.tabs[indx].base = ''
    //       this.tabs[indx].unit = ''
    //       this.cdRef.detectChanges()
    //     }
    //   },
    //   error: err => { this.isLoading = false },
    //   complete: () => {
    //     this.loadingSpinnerGraph = false
    //     this.ToggleGraph = true
    //     this.isLoading = false
    //   }
    // })

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

    var dataFile = this.proyectData[indexFilePanel].urlconvert
    var dataString = dataFile
    var og_unit: string = this.proyectData[indexFilePanel].unit

    // var dataString: string = localStorage.getItem('urlSearched')!
    // var dataFile: string = localStorage.getItem('urlFileUpload')!
    //var og_unit: string = localStorage.getItem('ogUnit')!

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

    this.obsApi.unitConvertion(dataToUse, sta, cha, base, type, fmin, fmax, corn, zero, min, max, og_unit, unit_to).subscribe({
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
    let mark = 'Descubre cómo nuestras soluciones avanzadas pueden proporcionar información crucial para el procesamiento sísmico y la seguridad estructural.'
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

  toogleActionsImg() {
    this.zoomActivate != this.zoomActivate
  }

  redirectAcel() {
    window.open('https://ncn.pe/acelerografo-reftek-sma2')
  }

} 
