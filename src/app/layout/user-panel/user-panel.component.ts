import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';

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

  username: any;
  email: any;
  group: any;
  name: any;
  groupNro: number = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {

    interval(100 * 1000).subscribe({

    })

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
        this.username = 'admin'
        this.email = 'admin@example.com'
        this.name = 'Admin Test'
      },
      complete: () => {

      }
    })
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
