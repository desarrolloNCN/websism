import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { VisorGraphComponent } from '../../pages/visor-graph/visor-graph.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ArchivoTXTComponent } from 'src/app/modules/uext/componentes/archivo-txt/archivo-txt.component';
import { RegisterUserService } from 'src/app/service/register-user.service';
import { AuthService } from 'src/app/service/auth.service';
import { ArchivoMseedComponent } from 'src/app/modules/uext/componentes/archivo-mseed/archivo-mseed.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { UserProjectsComponent } from '../../pages/user-projects/user-projects.component';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-new-project',
  animations: [
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
  ],
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.css']
})
export class NewProjectComponent implements OnInit {

  controlForm: FormGroup | any
  controlForm2: FormGroup | any

  arch: File[] | any = ''
  imgproj: File[] | any = ''

  defImg: string | ArrayBuffer | any = '/assets/ncnLogoColor.png'

  btnDisable = false
  showProgressBar = false

  showCalibration = false
  showUpdate = false

  aceeptedFiles = ['.seed', '.mseed', '.evt', '.txt']
  aceeptedImgFiles = ['.png', '.jpg', '.jpeg', '.gif']

  titleDialog = 'Nuevo Proyecto'
  subtitleDialog = 'Asigne un nombre a su proyecto, añada sus archivos con los que va a trabajar y'
  subtitleStrong = 'Crear Proyecto'

  buttonSubmitForm = 'Crear Proyecto'

  addedFiles: any[] = []

  regexURL = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;

  private username = ''
  private email = ''
  private idUser = ''
  private group: any
  private groupNro: any
  name = ''
  usere = ''

  constructor(
    private matDailogRef: MatDialogRef<UserProjectsComponent>,
    private snackBar: MatSnackBar,
    private matdialog: MatDialog,
    private regApi: RegisterUserService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.controlForm = new FormGroup({
      projectName: new FormControl('', Validators.required),
      descript: new FormControl(''),
      checkOps: new FormControl(false),
      imgProj: new FormControl('')
    })
  }

  ngOnInit(): void {
    // console.log('Editar', this.data);
    
    this.regApi.resetService()

    this.authService.getToken().subscribe({
      next: value => {
        this.username = value.username
        this.email = value.email

        this.group = value.groups
        this.name = value.name

        if (this.group['10']) {
          this.groupNro = 10
        } else {
          this.groupNro = 2
        }
      },
      error: err => {

        // TODO: Borrar en Produccion

        // if (this.data.uuid) {

        //   this.titleDialog = 'Editar Proyecto'
        //   this.subtitleDialog = 'Asigne un nuevo nombre a su proyecto, añada nuevos archivos con los que va a trabajar y'
        //   this.subtitleStrong = 'Actualizar Proyecto'

        //   this.buttonSubmitForm = 'Actualizar Proyecto'

        //   let uuid = this.data.uuid

        //   this.controlForm.controls['projectName'].setValue(this.data.name)
        //   this.controlForm.controls['descript'].setValue(this.data.descrip)

        //   this.controlForm.controls['checkOps'].setValue(this.data.checkM)

        //   this.defImg = this.data.img || '/assets/ncnLogoColor.png'

        //   this.data.files.forEach((e: any) => {
        //     let file_name = e.filename
        //     let nombreArchivo: string = file_name.substring(file_name.lastIndexOf('/') + 1);
        //     let extension: string = nombreArchivo.substring(nombreArchivo.lastIndexOf('.') + 1);

        //     let formatoNombre = this.formatearNombreArchivo(file_name, '', 12)

        //     if(e.format == 'REFTEK130'){
        //       e.status = 'Calibrado'
        //     }

        //     this.addedFiles.push({
        //       "id": e.id,
        //       "uuid": uuid,
        //       "projname": this.data.name,
        //       "projdesp": this.data.descrip,
        //       "file": '', 
        //       "fileName": formatoNombre,
        //       "originalName": file_name,
        //       "status": e.status,
        //       "info": e.info,
        //       "extension": e.format || extension.toLocaleUpperCase() || 'NO EXT',
        //       "string_data": e.string_data,
        //       "urlconvert": e.url_gen,
        //       "unit": e.unit
        //     })
        //   });
        // }

        // this.username = 'admin'
        // this.email = 'admin@example.com'
        // this.idUser = `${1}`
      },
      complete: () => {

        if (this.data.uuid) {

          this.titleDialog = 'Editar Proyecto'
          this.subtitleDialog = 'Asigne un nuevo nombre a su proyecto, añada nuevos archivos con los que va a trabajar y'
          this.subtitleStrong = 'Actualizar Proyecto'

          this.buttonSubmitForm = 'Actualizar Proyecto'

          let uuid = this.data.uuid

          this.controlForm.controls['projectName'].setValue(this.data.name)
          this.controlForm.controls['descript'].setValue(this.data.descrip)

          this.controlForm.controls['checkOps'].setValue(this.data.checkM)

          this.defImg = this.data.img || '/assets/ncnLogoColor.png'

          this.data.files.forEach((e: any) => {
            let file_name = e.filename
            let nombreArchivo: string = file_name.substring(file_name.lastIndexOf('/') + 1);
            let extension: string = nombreArchivo.substring(nombreArchivo.lastIndexOf('.') + 1);

            let formatoNombre = this.formatearNombreArchivo(file_name, '', 12)

            if(e.format == 'REFTEK130'){
              e.status = 'Calibrado'
            }

            this.addedFiles.push({
              "id": e.id,
              "uuid": uuid,
              "projname": this.data.name,
              "projdesp": this.data.descrip,
              "file": '', 
              "fileName": formatoNombre,
              "originalName": file_name,
              "status": e.status,
              "info": e.info,
              "extension": e.format || extension.toLocaleUpperCase() || 'NO EXT',
              "string_data": e.string_data,
              "urlconvert": e.url_gen,
              "unit": e.unit
            })
          });
        }

        this.authService.nUser(this.username, this.email, this.groupNro).subscribe({
          next: value => {
            this.idUser = value
          },
          error: err => {
            // TODO: Borrar en Produccion
            //this.idUser = `${1}`
          }
        })

      }
    })

    this.controlForm2 = new FormGroup({
      url: new FormControl('', [Validators.pattern(this.regexURL)]),

    })
  }

  @ViewChild('fileInput') fileInput!: ElementRef

  onFileSelected(event: any) {

    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 5 * 1000;
    snackBar.panelClass = ['snackBar-validator'];

    let archivos = event.target.files
    this.controlForm2.get('url').setValue('')

    let projName = this.controlForm.get('projectName').value
    let projDesp = this.controlForm.get('descript').value

    let statusCalib = ''

    this.showProgressBar = true

    if (archivos && archivos.length > 0) {

      for (let index = 0; index < archivos.length; index++) {

        let idProj = this.data.id || this.data.uuid

        let nombreArchivo: string = archivos[index].name.substring(archivos[index].name.lastIndexOf('/') + 1);
        let extension: string = nombreArchivo.substring(nombreArchivo.lastIndexOf('.') + 1);

        this.arch = ''
        this.arch = archivos[index];

        //this.controlForm2.get('url').disable()
        if (extension == 'seed' || extension == 'evt') {
          statusCalib = 'Calibrado'
        } else if (extension == nombreArchivo) {
          extension = ''
        } else {
          statusCalib = 'No Calibrado'
        }

        let formatoNombre = this.formatearNombreArchivo(archivos[index].name, extension, 12)

        this.regApi.uploadProjectFileUser(this.arch, this.idUser, idProj, archivos[index].name, statusCalib).subscribe({
          next: value => {

            if (value.msg) {
              this.snackBar.open(`⚠️ ${value.msg}`, 'cerrar', snackBar)
            } else {
              let urlconvert = ''
              let unit = ''

              if (value.f == 'MSEED' || extension == 'TXT' || extension == 'XMR') {
                statusCalib = 'No Calibrado'
                urlconvert = value.file
              } else if (value.f == 'KINEMETRICS_EVT' || value.f == 'REFTEK130' || extension == 'EVT') {
                statusCalib = 'Calibrado'
                if(value.f == 'REFTEK130'){
                  unit = 'gal'
                  statusCalib = 'Calibrado'
                }
                urlconvert = value.file
              }

              this.addedFiles.push({
                "file": archivos[index],
                "uuid": idProj,
                "projname": projName,
                "projdesp": projDesp,
                "fileName": formatoNombre,
                "originalName": archivos[index].name,
                "info": value.info,
                "status": statusCalib,
                "extension": value.f || extension.toLocaleUpperCase() || 'NO EXT',
                "id": value.id,
                "url": value.file,
                "unit": unit || '',
                "urlconvert": value.file
              })
            }

          },
          error: err => {
            this.showProgressBar = false
          },
          complete: () => {
            this.showProgressBar = false
          }
        })
      }


    } else {
      this.arch = null;
      this.showProgressBar = false
    }
  }

  onFileSelected2(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.imgproj = file
      this.readImage(file);
    }
  }

  readImage(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.defImg = e.target?.result;
    };
    reader.readAsDataURL(file);
  }

  formatearNombreArchivo(nombre: string, extension: string, longitudVisible: number) {
    const longitudExtension = extension.length + 1;
    const longitudSinExtension = nombre.length - longitudExtension;

    if (longitudSinExtension > longitudVisible) {
      const parteVisible = nombre.substring(0, longitudVisible);
      // ! Cambiar si es necesario
      //return parteVisible + '...' + extension;
      return parteVisible + '...';
    } else {
      return nombre;
    }
  }

  addUrl() {

    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 5 * 1000;
    snackBar.panelClass = ['snackBar-validator'];

    let statusCalib = ''

    if (this.controlForm2.invalid) {
      this.snackBar.open('⚠️ URL invalida', 'cerrar', snackBar)
    }

    const urlData = this.controlForm2.get('url').value
    let projName = this.controlForm.get('projectName').value
    let projDesp = this.controlForm.get('descript').value

    this.showProgressBar = true

    if (urlData != '') {

      let idProj = this.data.id || this.data.uuid

      let nombreArchivo: string = urlData.substring(urlData.lastIndexOf('/') + 1);
      let extension: string = nombreArchivo.substring(nombreArchivo.lastIndexOf('.') + 1);

      if (extension == 'seed' || extension == 'evt') {
        statusCalib = 'Calibrado'
      } else if (extension == nombreArchivo) {
        extension = ''
      } else {
        statusCalib = 'No Calibrado'
      }

      let formatoNombre = this.formatearNombreArchivo(nombreArchivo, extension, 12)

      this.regApi.uploadProjectFileUser(urlData, this.idUser, idProj, nombreArchivo, statusCalib).subscribe({
        next: value => {
          if (value.msg) {
            this.snackBar.open(`⚠️ ${value.msg}`, 'cerrar', snackBar)
          } else {

            let urlconvert = ''
            let unit = ''

            if (value.f == 'MSEED' || extension == 'TXT' || extension == 'XMR') {
              statusCalib = 'No Calibrado'
              urlconvert = value.string_data
            } else if (value.f == 'KINEMETRICS_EVT' || value.f == 'REFTEK130' || extension == 'EVT') {
              urlconvert = value.string_data
              if (value.f == 'REFTEK130') {
                unit = 'gal'
              }
              statusCalib = 'Calibrado'
            }

            this.addedFiles.push({
              "file": '',
              "fileName": formatoNombre,
              "originalName": nombreArchivo,
              "uuid": idProj,
              "projname": projName,
              "projdesp": projDesp,
              "status": statusCalib,
              "extension": extension.toLocaleUpperCase() || 'NO EXT',
              "id": value.id,
              "unit": unit || '',
              "url": value.string_data,
              "urlconvert": urlconvert
            })
          }

        },
        error: err => {
          this.showProgressBar = false
        },
        complete: () => {
          this.showProgressBar = false
        }
      })

      this.controlForm2.get('url').setValue('')

    } else {
      this.snackBar.open('Ingrese una URL', 'cerrar', snackBar)
      this.showProgressBar = false
    }

  }

  calibrarFile(item: any, index: number) {

    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 5 * 1000;
    snackBar.panelClass = ['snackBar-validator'];

    if (item.status == 'Error') {
      this.snackBar.open('⚠️ Borre este Archivo', 'cerrar', snackBar)
      return
    }

    const matDialogConfig = new MatDialogConfig()
    matDialogConfig.disableClose = true;
    matDialogConfig.data = item.urlconvert

    if (item.extension == 'TXT') {
      this.matdialog.open(ArchivoTXTComponent, matDialogConfig).afterClosed().subscribe({
        next: value => {
          if (value.url == '') {
            this.addedFiles[index].status = 'Error'
          } else {

            this.regApi.putFileProject(this.addedFiles[index].id, value.unit, 'Calibrado', this.addedFiles[index], value.url).subscribe({
              error: err => {
                this.addedFiles[index].status = 'Error'
              },
              complete: () => {
                this.addedFiles[index].status = 'Calibrado'
                this.addedFiles[index].unit = value.unit
                this.addedFiles[index].urlconvert = value.url
              }
            })
          }
        }
      })
    } else if (item.extension == 'MSEED') {
      this.matdialog.open(ArchivoMseedComponent, matDialogConfig).afterClosed().subscribe({
        next: value => {

          if (value.url == '') {
            this.addedFiles[index].status = 'Error'
          } else {

            this.regApi.putFileProject(this.addedFiles[index].id, value.unit, 'Calibrado', this.addedFiles[index], value.url).subscribe({
              error: err => {
                this.addedFiles[index].status = 'Error'
              },
              complete: () => {
                this.addedFiles[index].status = 'Calibrado'
                this.addedFiles[index].unit = value.unit
                this.addedFiles[index].urlconvert = value.url
              }
            })

          }
        }
      })
    } else if (item.extension == 'XMR') {
      this.regApi.covertionXMR(item.file).subscribe({
        next: val => {
          matDialogConfig.data = val.url
          this.matdialog.open(ArchivoTXTComponent, matDialogConfig).afterClosed().subscribe({
            next: value => {

              if (value.url == '') {
                this.addedFiles[index].status = 'Error'
              } else {

                this.regApi.putFileProject(this.addedFiles[index].id, value.unit, 'Calibrado', this.addedFiles[index], value.url).subscribe({
                  error: err => {
                    this.addedFiles[index].status = 'Error'
                  },
                  complete: () => {
                    this.addedFiles[index].status = 'Calibrado'
                    this.addedFiles[index].unit = value.unit
                    this.addedFiles[index].urlconvert = value.url
                  }
                })

              }
            }
          })
        },
        error: err => {
          this.snackBar.open('⚠️ Error en conversion', 'cerrar', snackBar)
        }
      })

    }
  }

  crearProject() {

    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 5 * 1000;
    snackBar.panelClass = ['snackBar-validator']

    const matDialogConfig = new MatDialogConfig()
    matDialogConfig.disableClose = true;

    let idProj = this.data.id || this.data.uuid

    if (this.controlForm.invalid) {
      this.snackBar.open('⚠️ Verificar Campos', 'cerrar', snackBar)
      return
    }

    if (this.addedFiles.length == 0) {
      this.snackBar.open('⚠️ Debe Agregar Archivos', 'cerrar', snackBar)
      return
    }

    if (!this.verificarFiles(this.addedFiles)) {
      this.snackBar.open('⚠️ Verificar Archivos', 'cerrar', snackBar);
      return;
    }

    if (this.data.id) {
      this.redirectLector(true)
    } else {

      let data = {
        "title": "Abrir Proyecto",
        "quest": "Desea abrir este Proyecto?"
      }

      matDialogConfig.data = data

      this.matdialog.open(DeleteConfirmationComponent, matDialogConfig).afterClosed().subscribe({
        next: value => {
          if (value == true) {
            this.redirectLector(true)
          } else {
            this.redirectLector(false)
            return
          }
        }
      })
    }

  }

  verificarFiles(arr: any[]): boolean {
    for (let e of arr) {
      if (e.status == 'Error' || e.status == 'No Calibrado') {
        return false
      }

    }
    return true
  }



  redirectLector(redirect: boolean) {

    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 5 * 1000;
    snackBar.panelClass = ['snackBar-validator']

    let idProj = this.data.id || this.data.uuid

    // console.log('Id proy', idProj);


    let projName = this.controlForm.get('projectName').value
    let projDesp = this.controlForm.get('descript').value
    let checkMerge = this.controlForm.get('checkOps').value

    let img = this.imgproj || this.defImg

    let msg_proj = ''

    // console.log('Redirector', this.addedFiles);

    this.showUpdate = true

    this.regApi.putProject(idProj, projName, projDesp, img, checkMerge).subscribe({
      next: (value: any[]) => {
        // * value es vacio si no hay merge
        if (value.length > 0) {
          this.addedFiles = []

          value.forEach((e: any) => {

            let nombreArchivo: string = e.filename.substring(e.filename.lastIndexOf('/') + 1);
            let extension: string = nombreArchivo.substring(nombreArchivo.lastIndexOf('.') + 1);

            this.addedFiles.push({
              "uuid": idProj,
              "id": e.id,
              "fileName": e.filename,
              "originalName": e.filename,
              "status": e.status,
              "extension": extension.toLocaleUpperCase() || 'NO EXT',
              "urlconvert": e.url_gen,
              "unit": e.unit,
              "tab": e.tab
            })

          });
        }
      },
      error: err => {
        this.snackBar.open('⚠️ Problema con el Registro ', 'cerrar', snackBar)
        this.matDailogRef.close()
        this.showUpdate = false
      },
      complete: () => {
        // console.log('Redirector after push', this.addedFiles);
        if (redirect) {
          this.sendData(this.addedFiles, '/user/lectorAcel')
          this.matDailogRef.close()
        }
        this.showUpdate = false
      }
    })

  }

  sendData(data: any, route?: string) {
    this.regApi.sendData(data, route);
  }

  delFile(item: any) {
    const matDialogConfig = new MatDialogConfig()
    matDialogConfig.disableClose = true;



    let data = {
      "title": "Borrar Archivo",
      "quest": "Desea borrar este Archivo?"
    }

    matDialogConfig.data = data

    const indice = this.addedFiles.indexOf(item);
    this.matdialog.open(DeleteConfirmationComponent, matDialogConfig).afterClosed().subscribe({
      next: value => {
        if (value == true) {
          if (indice !== -1) {
            this.regApi.delFileProject(item.id).subscribe({
              error: err => {
                // this.addedFiles.splice(indice, 1);
              },
              complete: () => {
                this.addedFiles.splice(indice, 1);
              }
            })
          }
        }
      }
    })

  }

  setColorStationChannel(value: string): any {

    const lastLetter = value.charAt(value.length - 1)

    if (value === 'Calibrado') {
      return {
        'background-color': 'rgb(54, 150, 54)',
        'padding': '5px',
        'font-weight': 'bold',
        'color': 'white',
        'border-radius': '20px'
      }
    } else {
      return {
        'background-color': 'rgb(252, 139, 139)',
        'padding': '5px',
        'font-weight': 'bold',
        'color': 'white',
        'border-radius': '20px'
      }
    }
  }

  close() {
    if (this.data.uuid) {
      this.matDailogRef.close()
    } else {
      this.regApi.delProject(this.data.id).subscribe({
        error: err => {

        },
        complete: () => {
          this.matDailogRef.close()
        }
      })
    }

  }

}
