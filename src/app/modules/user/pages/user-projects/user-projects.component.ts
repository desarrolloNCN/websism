import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RegisterUserService } from 'src/app/service/register-user.service';
import { NewProjectComponent } from '../../componentes/new-project/new-project.component';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { DeleteConfirmationComponent } from '../../componentes/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-user-projects',
  templateUrl: './user-projects.component.html',
  styleUrls: ['./user-projects.component.css']
})
export class UserProjectsComponent implements OnInit {

  proyectos: any = []

  loadingSpinner = false

  private username = ''
  private email = ''
  private group: any
  private groupNro :any
  name = ''
  usere = ''

  showmsg = true

  constructor(
    private userService: RegisterUserService,
    private authService: AuthService,
    private matDialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

    this.loadingSpinner = true

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
        this.loadingSpinner = false

        // TODO: Borrar en Produccion

        this.username = 'admin'
        this.email = 'admin@example.com'


        this.userService.getProjectuser(this.username, this.email).subscribe({
          next: value => {
            this.proyectos = value
          },
          error: err => {

          },
          complete: () => {
            this.loadingSpinner = false
          }
        })

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
              },
              error: err => {

              },
              complete: () => this.loadingSpinner = false
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
    console.log('abrirLector', item);
    
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
            "urlconvert": urlconvert
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

    if (indice !== -1) {

      this.matDialog.open(DeleteConfirmationComponent).afterClosed().subscribe({
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


}
