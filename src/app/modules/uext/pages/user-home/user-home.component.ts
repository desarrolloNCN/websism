import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { ObspyAPIService } from 'src/app/service/obspy-api.service';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {

  resp = ''
  errorNot = ''
  IniResp = ''
  showSpinner = false

  initContainer = {
    "background" : "/assets/mine.jpg"
  }

  constructor(
    private router: Router,
    private auth: AuthService,
    private obs: ObspyAPIService,
  ) { }

  ngOnInit(): void {

  }


  getJsonResponse() {

    this.showSpinner = true
    
    this.auth.getToken().subscribe({
      next: value => {
        this.resp = value
      },
      error: err => {
        this.showSpinner = false
        this.errorNot = err.message
      },
      complete: () => {
        this.showSpinner = false
        this.IniResp = 'Termino la Ejecucion'
      }
    })

  }


  redirecToVisor() {
    this.router.navigateByUrl('/user/visor')
  }

}
