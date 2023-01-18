import { Component, OnInit } from '@angular/core';
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
export class HomeComponent implements OnInit {

  loggedIn: boolean = false;
  username: string = "";

  constructor(private authService: AuthService, private creatureService: CreatureService, private authInterceptor: AuthHeaderInterceptor) {

    // this.authService.loggedIn
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
      });//todo stejný kód jako v navbar component

    /*this.authService.loggedIn.subscribe({
      next: (loggedIn) => {
        this.loggedIn = loggedIn;

        if (loggedIn) {
          this.username = this.authService.user.name;
        } else {
          this.username = "";
        }
      }
    });*/


  }

  ngOnInit(): void {
    /*if (this.loggedIn) {
      this.username = this.authService.user.name;
    }*/
  }

  logout() {
    this.authService.logout();
  }

}
