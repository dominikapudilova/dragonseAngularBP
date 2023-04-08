import { Component } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Observable, switchMap} from "rxjs";
import {User} from "../models/user";
import {CreatureService} from "../services/creature.service";
import {AuthHeaderInterceptor} from "../services/auth-header.interceptor";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  loggedIn: boolean = false;
  username: string = "";

  constructor(private authService: AuthService, private creatureService: CreatureService, private authInterceptor: AuthHeaderInterceptor) {

    this.authInterceptor.loggedIn
      .pipe(
        switchMap((loggedIn, index) => {
          this.loggedIn = loggedIn;
          if (this.loggedIn) {
            return this.authService.user;
          }
          return new Observable<User>();
        }))
      .subscribe({
        next: (user) => {
          this.username = user.name;
        }
      });
  }

  logout() {
    this.authService.logout();
  }

}
