import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {AuthService} from "./auth.service";
import {map} from "rxjs";
import {AuthHeaderInterceptor} from "./auth-header.interceptor";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{

  constructor(private authService: AuthService, private router: Router, private authInterceptor: AuthHeaderInterceptor) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
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
