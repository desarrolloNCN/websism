import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RegisterUserService } from 'src/app/service/register-user.service';
import { NewProjectComponent } from '../../componentes/new-project/new-project.component';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { DeleteConfirmationComponent } from '../../componentes/delete-confirmation/delete-confirmation.component';
import { FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-user-projects',
  templateUrl: './user-projects.component.html',
  styleUrls: ['./user-projects.component.css']
})
export class UserProjectsComponent implements OnInit {

  controlForm: FormGroup | any

  proyectos: any[] = []
  pageData: any[] = []

  loadingSpinner = false

  private username = ''
  private email = ''
  private group: any
  private groupNro: any
  name = ''
  usere = ''

  totalElementos: any

  buscarTexto = ''

  showmsg = true
  disableBtns = false

  stdate: any;
  endate: any;

  constructor(
    private userService: RegisterUserService,
    private authService: AuthService,
    private matDialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {
    this.controlForm = new FormGroup({

    })

  }

  ngOnInit(): void {

    this.loadingSpinner = true
    // this.disableBtns = true

    this.authService.getToken().subscribe({
      next: value => {
        this.username = value.username
        this.email = value.email
        this.usere = value.email
        this.group = value.groups
        this.name = value.name

        if (this.group['10']) {
          this.showmsg = false
          this.groupNro = 10
        } else {
          this.showmsg = true
          this.groupNro = 2
        }

      },
      error: err => {
        this.loadingSpinner = true

        // TODO: Borrar en Produccion

        // this.username = 'admin'
        // this.email = 'admin@example.com'


        // this.userService.getProjectuser(this.username, this.email).subscribe({
        //   next: value => {
        //     this.proyectos = value
        //     console.log('Editar Button',this.proyectos);
            
        //     this.pageData = this.proyectos
        //     this.totalElementos = this.proyectos.length
        //   },
        //   error: err => {

        //   },
        //   complete: () => {
        //     this.loadingSpinner = false
        //    // this.disableBtns = true
        //   }
        // })

      },
      complete: () => {

        this.authService.nUser(this.username, this.email, this.groupNro).subscribe({
          error: err => {
            // TODO: Agregar en desarrollo
            this.loadingSpinner = false
          },
          complete: () => {
            this.userService.getProjectuser(this.username, this.email).subscribe({
              next: value => {
                this.proyectos = value
                this.pageData = this.proyectos
                this.totalElementos = this.proyectos.length
              },
              error: err => {

              },
              complete: () => {
                this.loadingSpinner = false
                // this.disableBtns = true
              }

            })
          }
        })


      }
    })

    // this.getProyectos()
  }


  crearProyecto() {

    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 5 * 1000;
    snackBar.panelClass = ['snackBar-validator'];

    const matDialogConfig = new MatDialogConfig()
    matDialogConfig.disableClose = true;

    this.userService.newProject(this.username, this.email).subscribe({
      next: value => {
        if (value.msg) {
          this.snackBar.open(`⚠️ ${value.msg}`, 'cerrar', snackBar)
        } else {
          matDialogConfig.data = value
          this.matDialog.open(NewProjectComponent, matDialogConfig)
        }
      },
      error: err => {
        this.snackBar.open(`⚠️ ${err}`, 'cerrar', snackBar)
      },
      complete: () => {
        this.snackBar.open('✅ Proyecto Creado', 'cerrar', snackBar)
        // this.snackBar.open(`⚠️ ${matDialogConfig.data.msg}`, 'cerrar', snackBar)
      }
    })
  }

  abrirLector(item: any) {
    // console.log('abrirLector', item);

    this.userService.resetService()

    let addFiles: any[] = []

    let shouldContinueIteration = true;

    item.files.forEach((e: any) => {
      if (shouldContinueIteration) {
        if (e.status === "No Calibrado") {
          shouldContinueIteration = false;
        } else {
          let url = e.file || e.string_data;
          let urlconvert = e.url_gen;
          let nombreArchivo: string = url.substring(url.lastIndexOf('/') + 1);
          let extension: string = nombreArchivo.substring(nombreArchivo.lastIndexOf('.') + 1);

          addFiles.push({
            "uuid": item.uuid,
            "id": e.id,
            "originalName": nombreArchivo,
            "extension": extension.toLocaleUpperCase() || 'NO EXT',
            "unit": e.unit,
            "img": e.img,
            "tab": item.tab,
            "urlconvert": urlconvert,
            "projname" : item.name,
            "projdesp" : item.descrip,
          });
        }
      }
    });

    this.sendData(addFiles, 'user/lectorAcel')

  }

  editProyec(item: any) {
    const matDialogConfig = new MatDialogConfig()
    matDialogConfig.disableClose = true;
    matDialogConfig.data = item
    this.matDialog.open(NewProjectComponent, matDialogConfig).afterClosed().subscribe({
      complete: () => {
        this.ngOnInit()
      }
    })
  }

  sendData(data: any, route?: string) {
    this.userService.sendData(data, route);
  }

  delProj(item: any) {

    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 5 * 1000;
    snackBar.panelClass = ['snackBar-validator']

    const indice = this.proyectos.indexOf(item);

    const matDialogConfig = new MatDialogConfig()
    matDialogConfig.disableClose = true;

    let data = {
      "title": "Borrar Archivo",
      "quest": "Desea borrar este Archivo?"
    }

    matDialogConfig.data = data

    if (indice !== -1) {

      this.matDialog.open(DeleteConfirmationComponent, matDialogConfig).afterClosed().subscribe({
        next: value => {
          if (value == true) {
            this.userService.delProject(item.uuid).subscribe({
              error: err => {

              },
              complete: () => {
                this.proyectos.splice(indice, 1);
                this.snackBar.open('✅ Proyecto Borrado', 'cerrar', snackBar)
              }
            })
          }
        },
        error: err => {
          this.snackBar.open('⚠️ Ocurrio un Problema', 'cerrar', snackBar)
        },
        complete: () => {

        }
      })


    }


  }

  filterDataT(data: any): boolean {
    const searchLower = this.buscarTexto ? this.buscarTexto.toLowerCase() : '';
    const nameMatch = data.name && data.name.toLowerCase().includes(searchLower);
    const despMatch = data.descrip && data.descrip.toLowerCase().includes(searchLower);

    let date = data.fecha_creacion
    let fechaFormated = date ? this.datePipe.transform(date, 'M/d/yy, h:mm a') : '';

    const fechaMatch = fechaFormated ? fechaFormated.toLowerCase().includes(searchLower) : false;

    let fileMatch = false;

    if (data.files && data.files.length > 0) {
      data.files.forEach((file: any) => {
        if (file && file.filename && file.filename.toLowerCase().includes(searchLower)) {
          fileMatch = true;
        }
      });
    }

    return nameMatch || despMatch || fechaMatch || fileMatch
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;

    this.proyectos = this.pageData.slice(startIndex, endIndex);
  }


}
