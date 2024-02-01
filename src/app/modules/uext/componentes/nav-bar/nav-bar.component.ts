import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { delay } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  apiAuth: any = {}
  showUserNav = false
  hideCommonAuth = true

  constructor(
    private auth: AuthService
  ) {
    delay(5000)
  }

  ngOnInit(): void {
    window.addEventListener('popstate', this.onBackButtonClicked.bind(this));
    this.getAuthCrede()
  }

  redirect() {
    window.location.href = 'https://qs.ncn.pe/site/'
  }

  redirectRegister() {
    window.location.href = 'https://qs.ncn.pe/site/index.php/component/users/registration?Itemid=101'
  }

  onBackButtonClicked(event: PopStateEvent): void {
    window.location.reload();
  }

  getAuthCrede() {

    this.auth.getToken().subscribe({
      next: value => {

        if (value.name == null) {
          return
        } else {
          this.showUserNav = true
          this.hideCommonAuth = false
          this.apiAuth = value
        }
      },
      error: err => {
        this.showUserNav = false
        this.hideCommonAuth = true
      },
      complete: () => {
      }

    })
  }

}
