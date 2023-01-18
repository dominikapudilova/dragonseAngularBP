import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {AuthService} from "./auth.service";
import {AuthHeaderInterceptor} from "./auth-header.interceptor";

@Injectable({
  providedIn: 'root'
})
export class LoginResolver implements Resolve<boolean>{

  constructor(private authService: AuthService, private authInterceptor: AuthHeaderInterceptor) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    console.log("...RESOLVING IF LOGGED IN...");
    // return this.authService.loggedIn;
    return this.authInterceptor.loggedIn;
  }
}
