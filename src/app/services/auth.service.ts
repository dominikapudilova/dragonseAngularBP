import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { environment } from "../../environments/environment";
import {BehaviorSubject, firstValueFrom, map, Observable} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import { User } from "../models/user";
import jwtDecode from "jwt-decode";
import {UserService} from "./user.service";
import {AuthHeaderInterceptor} from "./auth-header.interceptor";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /*AuthService executes login and logout actions.*/
  /*Recognizes and keeps info about logged user for later use by other components*/
  /*Works with JWT token*/

  readonly COOKIE_TOKEN_NAME = "token";
  private token: string = "";
  // private _loggedIn: boolean = false;
  // private _user: any = {};
  private _user: any = {};

  //subscription object of loggedIn
  // private _loggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  //subscription object for logged in User
  private _userSubscription: BehaviorSubject<any> = new BehaviorSubject(this._user);

  //public headers with auth token
  // public authHeaders: HttpHeaders = new HttpHeaders();

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private userService: UserService, private authHeaderInterceptor: AuthHeaderInterceptor) {
    let token = this.authHeaderInterceptor.token;
    if (token) {
      this.token = token;
      // this.authHeaders = this.prepareAuthHeaders();
      this.assignUserFromJwt();
    }
  }

  get user() : Observable<User> {
    return this._userSubscription;
  }

  /*get loggedIn(): Observable<boolean> {
    return this._loggedIn;
  }*/

  login(user: object) {
    // return this.http.post(environment.API_URL + "login", JSON.stringify(user));
    /*return this.http.post(environment.API_URL + "login", JSON.stringify(user)).subscribe({
      next: (res: any) => {

        console.log("Získávám token");
        console.log(res.jwt);
        console.log("Ukládám do cookie");
        //get token
        //get expiration
        //save token as cookie
      },

      error: (error: HttpErrorResponse) => {console.log(error.error.message); throwError(error);}
    });*/

    return this.http.post(environment.API_URL + "login", JSON.stringify(user)).pipe(
      map((res: any) => {
        if (res.jwt) {
          //save token globally
          this.token = res.jwt;

          //build auth headers upon logging in for other components
          // this.authHeaders = this.prepareAuthHeaders();

          //let interceptor know that new token was created
          this.authHeaderInterceptor.login(this.token);
          //--------------------------------------

          //save to user obj
          this.assignUserFromJwt();

          //prepare cookie expiry
          let tokenExpireAtDate = new Date();
          if (res.expireAt) {
            tokenExpireAtDate.setTime((res.expireAt) * 1000); //JS works in millis, not seconds
          }

          //save token to local storage
          let expiresCookie = tokenExpireAtDate > new Date() ? ("expires=" + tokenExpireAtDate.toUTCString() + ";") : "";
          document.cookie = this.COOKIE_TOKEN_NAME + "=" + this.token + "; Path='/'; " + expiresCookie + " SameSite=Strict;";

          //redirect authenticated user to dashboard
          let returnUrl = this.route.snapshot.queryParams['returnUrl'];
          if (returnUrl) {
            this.router.navigateByUrl(returnUrl);
          } else {
            this.router.navigateByUrl("dashboard");
          }
        } else {
          throw new Error('Token was not received from server. Cannot login!');
        }
      })
    );

  }

  logout() {
    //remove user data
    // this._user = {};
    this._userSubscription.next({}); //probably useless if subscription completes

    //emit loggedIn = false to subscribed components
    // this._loggedIn.next(false);

    //remove token
    this.deleteTokenFromCookie()

    //tell interceptor to not look for token
    this.authHeaderInterceptor.logout();
  }

  register(username: string, password: string) {
    let userObj = { username: username, password: password };
    return firstValueFrom(this.http.post(environment.API_URL + "register", userObj));
  }

  /*prepareAuthHeaders() {
    return new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', "Bearer: " + this.token);
  }*/

  /*private getTokenFromCookie() {
    let cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith(this.COOKIE_TOKEN_NAME + '='))
      ?.split('=')[1];

    if (cookieValue) { return cookieValue; }
    return false;
  }*/

  private deleteTokenFromCookie() {
    document.cookie = this.COOKIE_TOKEN_NAME +'=; Path="/";  Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  private assignUserFromJwt() {

    let tokenData: any = jwtDecode(this.token);
    tokenData = tokenData.data;

    // this._user.name = tokenData.username;
    // this._user.id = tokenData.id;
    // this._user.admin = false; //TODO NENI ADMIN
    this._user.name = tokenData.username;
    this._user.id = tokenData.id;
    this._user.profilePic = tokenData['profile_pic'];
    this._user.admin = false;

    //get other data by new GET request
    // this.assignAdditionalUserData();

    // this._loggedIn = true;
    //emit logged in
    // this._loggedIn.next(true);

    this._userSubscription.next(this._user);
    // this._userSubscription.complete();
  }

  /*private assignAdditionalUserData() {
    this.userService.getUserById(this._user.id).subscribe((userData: any) => {
      this._user.profilePic = userData['profile_pic'];
      this._user.admin = userData['admin'];

      //emit user with more info now
      this._userSubscription.next(this._user);
      this._userSubscription.complete();
    });
  }*/
}
