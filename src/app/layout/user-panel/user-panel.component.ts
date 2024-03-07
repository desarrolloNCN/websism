import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition('void <=> *', animate(200)),
    ]),
  ]
})
export class UserPanelComponent implements OnInit {

  isSidenavOpened = false;
  sidenavWidth = 250; // Ancho del sidenav cuando está abierto

  isExpanded = true

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  logout() {
    this.router.navigateByUrl('/home')
  }

  redirect() {
    window.location.href = 'https://qs.ncn.pe/site/'
  }

  
  profileRedirect() {
    window.location.href = 'https://qs.ncn.pe/site/index.php/cb-profile-edit'
  }

  

  toggleSidenav(): void {
    this.isSidenavOpened = !this.isSidenavOpened;
    this.sidenavWidth = this.isSidenavOpened ? 250 : 80;
  }

}
