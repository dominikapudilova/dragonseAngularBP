import {Component} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {AuthHeaderInterceptor} from "../services/auth-header.interceptor";

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent {

  loggedIn: boolean = false;
  constructor(private authService: AuthService, private authInterceptor: AuthHeaderInterceptor) {
    this.authInterceptor.loggedIn.subscribe(
      (loggedIn) => {
        this.loggedIn = loggedIn;
      }
    );
  }

}
