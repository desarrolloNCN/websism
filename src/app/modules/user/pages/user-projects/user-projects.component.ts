import { Component, OnInit } from '@angular/core';
import { RegisterUserService } from 'src/app/service/register-user.service';

@Component({
  selector: 'app-user-projects',
  templateUrl: './user-projects.component.html',
  styleUrls: ['./user-projects.component.css']
})
export class UserProjectsComponent implements OnInit {

  proyectos: any = []
  ud = '75d0aa04-8001-4812-86ea-33f686eead0e'
  loadingSpinner = false
  constructor(
    private userService : RegisterUserService
  ) { }

  ngOnInit(): void {
    // this.getProyectos()
  }

  getProyectos(){

    this.loadingSpinner = true

    this.userService.getProjectUser(this.ud).subscribe({
      next: value => {
        this.proyectos = value
      },
      error: err => {
        this.loadingSpinner = false
        
      },
      complete: () => {
        this.loadingSpinner = false
      }
    })
  }

  crearProyecto(){
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


}
