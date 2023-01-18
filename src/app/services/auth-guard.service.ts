import {Injectable, OnInit} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {AuthService} from "./auth.service";
import {map, Observable, tap} from "rxjs";
import {AuthHeaderInterceptor} from "./auth-header.interceptor";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{

  constructor(private authService: AuthService, private router: Router, private authInterceptor: AuthHeaderInterceptor) { } //remove auth service

  /*canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean  {
    console.log("Zde observable: ");
    console.log(this.authService.loggedIn);

    this.authService.loggedIn.pipe(take(1)).subscribe({ next: loggedIn => {
        console.log(loggedIn);
        if (loggedIn) {

          // return true;
        } else {

          // return false;
        }
      }});

    if (this.authService.loggedIn) { return true; }

    this.router.navigate(['/'], { queryParams: {returnUrl: state.url} }); //save originally requested page (state.url) to be returned to when user logs in
    return false;
  }*/

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    /*return new Observable<boolean>(obs => {
      this.authInterceptor.loggedIn.subscribe(
        loggedIn => {
          if (loggedIn) {
            obs.next(true);
          } else {
            this.router.navigate(['/'], { queryParams: {returnUrl: state.url} });
            obs.next(false);
          }
        }
      );
    });*/
    /*if (this.loggedIn) {
      return true;
    } else {
      this.router.navigate(['/'], { queryParams: {returnUrl: state.url} });
      return false;
    }*/
    /*let token = this.authInterceptor.getTokenFromCookie();
    if (token) {
      console.log("Can activate TRUE")
      return true;
    } else {
      console.log("Can activate FALSE")
      this.router.navigate(['/'], { queryParams: {returnUrl: state.url} });
      return false;
    }*/
    /*return this.authInterceptor.loggedIn.pipe(
      tap(loggedIn => {
        console.log(loggedIn);
        if (loggedIn) {
          return true;
        }
        else {
          this.router.navigate(['/'], { queryParams: {returnUrl: state.url} });
          return false;
        }
      })
    )*/

    return this.authInterceptor.loggedIn.pipe(
      map(loggedIn => {
        if (loggedIn) { return true; }
        else {
          this.router.navigate(['/'], { queryParams: {returnUrl: state.url} });
          return false;
        }
      })
    );
  }
}
