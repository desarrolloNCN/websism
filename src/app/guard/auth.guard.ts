import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private isAuth = false

  constructor(
    private authService: AuthService,
    private router: Router
  ) {

    this.authService.getToken().subscribe({
      next: value => {
        
        console.log(value.username);
        
        if (!value.username || value.username == 'null' || value.username == null || value.username == undefined) {
          this.isAuth = false
        } else {
          this.isAuth = true
        }

      },
      error: err => {
        this.isAuth = false
      },
    })

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.isAuth) {
      this.router.navigate(['/user']);
      return true
    } else {
      this.router.navigateByUrl('https://qs.ncn.pe/site')
      return false
    }

  }

}
