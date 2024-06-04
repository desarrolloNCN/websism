import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const snackBar = new MatSnackBarConfig();
    snackBar.duration = 5 * 1000;
    snackBar.panelClass = ['snackBar-validator'];

    return this.authService.getToken().pipe(
      map((data) => {
        if (data.username == null) {
          this.snackBar.open('⚠️ Acceso Denegado', 'cerrar', snackBar)
          this.router.navigateByUrl('/home')
          return false
        } else {
          return true
        }
      }),
      catchError(() => {
        this.router.navigateByUrl('/home')
        return of(false)
      })
    )
    return true
  }

}
