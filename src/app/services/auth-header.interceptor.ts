import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthHeaderInterceptor implements HttpInterceptor {

  private readonly COOKIE_TOKEN_NAME = "token";
  public token: string = "";
  private authHeaders: any;
  private _loggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() {
    let token = this.getTokenFromCookie();
    if (token) {
      this.login(token);
    }
  }

  get loggedIn(): Observable<boolean> {
    return this._loggedIn;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    //if not logged in, check for token again
    let token = this.getTokenFromCookie();
    if (token) {
      this.login(token);
      return next.handle(req.clone({headers: this.authHeaders}))
    }

    if (this._loggedIn.getValue()) { //if true, log out - logged out / token expired / no token found
      this._loggedIn.next(false);
    }

    //if still no token
    return next.handle(req);
  }

  public login(token: string) {
    this.token = token;
    this.authHeaders = this.prepareAuthHeaders();
    this._loggedIn.next(true);
  }

  public logout() {
    this.token = "";
    this.authHeaders = {};
    this._loggedIn.next(false);
  }

  private prepareAuthHeaders() {
    return new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', "Bearer: " + this.token);
  }

  public getTokenFromCookie() {
    let cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith(this.COOKIE_TOKEN_NAME + '='))
      ?.split('=')[1];

    if (cookieValue) { return cookieValue; }
    return false;
  }
}
