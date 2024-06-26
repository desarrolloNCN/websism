import { trigger, transition, animate, style } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { delay } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-nav-bar',
  animations: [
    trigger('bellAnimation', [
      transition(':enter', [
        animate('1s', style({ transform: 'rotate(-20deg)' })),
        animate('1s', style({ transform: 'rotate(20deg)' })),
        animate('1s', style({ transform: 'rotate(0deg)' }))
      ]),
    ]),
  ],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  apiAuth: any = {}
  showUserNav = false
  hideCommonAuth = true

  animateBell: boolean = true;

  constructor(
    private auth: AuthService
  ) {
    delay(5000)
    this.getAuthCrede()
  }

  ngOnInit(): void {
    window.addEventListener('popstate', this.onBackButtonClicked.bind(this));
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
          localStorage.setItem('tk', value.token)
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

  ringBell() {
    this.animateBell = !this.animateBell;
  }

  redirectAcel(){
    window.open('https://ncn.pe/acelerografo-reftek-sma2')
  }

  redirectScri(){
    window.open('https://ncn.pe/widget')
  }

}
