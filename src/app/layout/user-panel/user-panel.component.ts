import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.css']
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
    // Ajustar el ancho del sidenav dependiendo de si está abierto o cerrado
    this.sidenavWidth = this.isSidenavOpened ? 250 : 80; // Ajusta el ancho deseado cuando el sidenav está cerrado
  }

}
