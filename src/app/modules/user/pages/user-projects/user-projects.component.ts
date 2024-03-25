import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RegisterUserService } from 'src/app/service/register-user.service';
import { NewProjectComponent } from '../../componentes/new-project/new-project.component';
import { AuthService } from 'src/app/service/auth.service';

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

  constructor(
    private userService: RegisterUserService,
    private authService: AuthService,
    private matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.authService.getToken().subscribe({
      next: value => {
        this.username = value.email
        this.email = value.email
      },
      error: err => {
        this.username = 'ga'
        this.email = 'test@example.com'

        // TODO: Borrar en Produccion

        this.userService.getProjectuser(this.username, this.email).subscribe({
          next: value => {
            this.proyectos = value
            console.log(value);

          },
          error: err => {

          }
        })
      },
      complete: () => {
        console.log(this.username, this.email)

        this.userService.getProjectuser(this.username, this.email).subscribe({
          next: value => {
            this.proyectos = value
            console.log(value);

          },
          error: err => {

          }
        })
      }
    })
    // this.getProyectos()
  }


  crearProyecto() {

    const matDialogConfig = new MatDialogConfig()
    matDialogConfig.disableClose = true;

    this.userService.newProject(this.username, this.email).subscribe({
      next: value => {
        matDialogConfig.data = value
      },
      error: err => {

      },
      complete: () => {
        this.matDialog.open(NewProjectComponent, matDialogConfig)
      }
    })



    // this.userService.postProjectUser(this.ud).subscribe({
    //   next: value => {

    //   },
    //   error: err => {
    //     this.loadingSpinner = false
    //   },
    //   complete: () => {
    //     this.getProyectos()
    //   }
    // })
  }

  abrirLector(item: any) {
    console.log(item);

    let addFiles : any[] = []

    item.files.forEach((e: any) => {
      let url = e.file || e.string_data
      let nombreArchivo: string = url.substring(url.lastIndexOf('/') + 1);
      let extension: string = nombreArchivo.substring(nombreArchivo.lastIndexOf('.') + 1);

      addFiles.push({
        "originalName": nombreArchivo,
        "extension": extension.toLocaleUpperCase() || 'NO EXT',
        "unit": e.unit,
        "url": url
      })

    });

    this.sendData(addFiles, '/user/lectorAcel')


  }

  sendData(data: any, route?: string) {
    this.userService.sendData(data, route);
  }


}
