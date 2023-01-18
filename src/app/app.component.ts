import { Component } from '@angular/core';
import {AuthService} from "./services/auth.service";
import {ResourceService} from "./services/resource.service";
import {AuthHeaderInterceptor} from "./services/auth-header.interceptor";
import {mergeMap} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Dragonse Angular';
  loggedIn: boolean = false;

  constructor(private authInterceptor: AuthHeaderInterceptor) {
    // this.authService.loggedIn.subscribe((loggedIn) => {
    this.authInterceptor.loggedIn.subscribe((loggedIn) => {
      // .subscribe((loggedIn) => {
      this.loggedIn = loggedIn;
    });
  }
}
