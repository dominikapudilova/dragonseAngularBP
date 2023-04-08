import { Component } from '@angular/core';
import {AuthHeaderInterceptor} from "./services/auth-header.interceptor";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Dragonse Angular';
  loggedIn: boolean = false;

  constructor(private authInterceptor: AuthHeaderInterceptor) {
    this.authInterceptor.loggedIn.subscribe((loggedIn) => {
      this.loggedIn = loggedIn;
    });
  }
}
