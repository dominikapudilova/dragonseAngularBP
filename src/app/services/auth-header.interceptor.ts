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
  // private loggedInLocal = false;
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

  // public setLoggedIn(loggedIn: boolean) {
  //   this.loggedIn = loggedIn;
  // }
  // public getLoggedIn() {
  //   return this.loggedIn;
  // }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    /*next.handle(req).pipe(tap((event: HttpEvent<any>) => {
      // if (event instanceof HttpResponse) {
        console.log(event);
      // }
    }));*/
    /*next.handle(req).pipe(tap((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        // any way to alter response that gets sent to the request subscriber?
        console.log("toto je httpresponse");
        return next.handle(req);
      } else {
        if (this.loggedIn) {
          console.log("toto NENÍ httpresponse, jsme loggedin přidávám headers");
          return next.handle(req.clone({headers: this.authHeaders}))
        }
        return next.handle(req);
      }
    }, (error: any) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401 || error.status === 403) {
          console.log('The authentication session has expired or the user is not authorised. Redirecting to login page.');
          if ((error.error).includes("Expired token")) {
            console.log("Token expired, logging out")
            this.logout();
          }
          // this.router.navigate(['/login']);
        }
      }
    }));*/

    // console.log("interceptor token: ");
    // console.log(this.token)
    // console.log(this.loggedIn)

    //if logged in when sending request
    /*if (this.loggedIn) {
      return next.handle(req.clone({headers: this.authHeaders}))
    }*/

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

    /*return this.authService.loggedIn
      .pipe(
        switchMap(loggedIn => {
          let headers = new HttpHeaders();
          if (loggedIn) {
            headers = this.authService.authHeaders;
          }
          return next.handle(req.clone({headers: headers}))
        })
      );*/
    /*return from(this.authService.getToken())
      .pipe(
        switchMap(token => {
          const headers = request.headers.set('Authorization', 'Bearer ' + token).append('Content-Type', 'application/json');
          const requestClone = request.clone({
            headers
          });
          return next.handle(requestClone);
        })
      );*/
    /*firstValueFrom(this.authService.loggedIn).then(
      (loggedIn) => {
        if (loggedIn) {
          return next.handle(req.clone({
            headers: this.authService.authHeaders
          }));
        } else {
          return next.handle(req);
        }
      },
      () => {
        return next.handle(req);
      }
    );*/
    /*if (this.authService.authHeaders) { // e.g. if token exists, otherwise use incomming request.
      return next.handle(req.clone({
        setHeaders: {
          'AuthenticationToken': localStorage.getItem('TOKEN'),
          'Tenant': localStorage.getItem('TENANT')
        }
      }));
    }
    else {
      return next.handle(req);
    }*/
  }

  public login(token: string) {
    this.token = token;
    // this.loggedIn = true;
    this.authHeaders = this.prepareAuthHeaders();
    this._loggedIn.next(true);
  }

  public logout() {
    this.token = "";
    this.authHeaders = {};
    // this.loggedIn = false;
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
