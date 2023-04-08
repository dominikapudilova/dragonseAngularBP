import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
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
  private _user: any = {};

  private _userSubscription: BehaviorSubject<any> = new BehaviorSubject(this._user);

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private userService: UserService, private authHeaderInterceptor: AuthHeaderInterceptor) {
    let token = this.authHeaderInterceptor.token;
    if (token) {
      this.token = token;
      this.assignUserFromJwt();
    }
  }

  get user() : Observable<User> {
    return this._userSubscription;
  }

  login(user: object) {

    return this.http.post(environment.API_URL + "login", JSON.stringify(user)).pipe(
      map((res: any) => {
        if (res.jwt) {
          //save token globally
          this.token = res.jwt;

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
    this._userSubscription.next({}); //probably useless if subscription completes

    //remove token
    this.deleteTokenFromCookie()

    //tell interceptor to not look for token
    this.authHeaderInterceptor.logout();
  }

  register(username: string, password: string) {
    let userObj = { username: username, password: password };
    return firstValueFrom(this.http.post(environment.API_URL + "register", userObj));
  }

  private deleteTokenFromCookie() {
    document.cookie = this.COOKIE_TOKEN_NAME +'=; Path="/";  Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  private assignUserFromJwt() {

    let tokenData: any = jwtDecode(this.token);
    tokenData = tokenData.data;

    this._user.name = tokenData.username;
    this._user.id = tokenData.id;
    this._user.profilePic = tokenData['profile_pic'];
    this._user.admin = false;

    this._userSubscription.next(this._user);
  }
}
