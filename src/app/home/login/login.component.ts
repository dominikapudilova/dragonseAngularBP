import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";
import {ErrorService} from "../../shared/error-service";

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.minLength(4), Validators.required]),
    password: new FormControl('', [Validators.minLength(4), Validators.required])
  });

  errors: Array<string> = [];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  login() {
    if (this.loginForm.invalid) return;
    this.errors = []; //reset errors

    let user = {username: this.username?.value, password: this.password?.value}

    this.authService.login(user).subscribe({
      error: (err: HttpErrorResponse) => {
        let errorMessage = ErrorService.getErrorMessage(err);
        this.errors.push(errorMessage);
      }
    });

    /*this.authService.login(user).subscribe({
      next: (res: any) => {console.log(res)},
      error: (err: HttpErrorResponse) => {
        let errorMessage = "";
        if (err.error?.message) {
          errorMessage = err.error.message;
        } else {
          if (err.status == 503) {
            errorMessage = "Service is unavailable. Try again later.";
          } else {
            errorMessage = "Something went wrong. Contact admin.";
          }
        }
        this.errors.push(errorMessage);

        // this.errors.push(err.error?.message ? err.error.message : err.message);
        // console.log(!!err.error)
        // console.log("-------")
        // console.log("Error: ") ;console.log(err);
        // console.log("This errors:") ;console.log(this.errors)
      }
    });*/

  }

  get username() {
    return this.loginForm.get('username');
  }
  get password() {
    return this.loginForm.get('password');
  }

}
