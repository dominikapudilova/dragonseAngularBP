import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {ErrorService} from "../../shared/error-service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./../home.component.css', './register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm = new FormGroup({
    username: new FormControl('', [Validators.minLength(4), Validators.required]),
    password: new FormControl('', [Validators.minLength(4), Validators.required]),
    passwordConfirmation: new FormControl('', [Validators.minLength(4), Validators.required])
  });

  errors: Array<string> = [];

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  register() {
    if (this.registerForm.invalid) return;
    this.errors = []; //reset errors

    if (this.password?.value != this.passwordConfirmation?.value) {
      this.errors.push("Given passwords do not match.");
      return;
    }

    if (this.validateFormFieldExistsAndNotEmpty(this.username) && this.validateFormFieldExistsAndNotEmpty(this.password)) {
      this.authService.register(this.username!.value!, this.password!.value!).then(
        (res: any) => {
          if (res.success) {
            this.router.navigate(["/"]);
          } else {
            if (res.message) {
              this.errors.push(res.message);
            }
          }
        }, (error) => {
          this.errors.push(ErrorService.getErrorMessage(error));
        }
      );
    } else {
      this.errors.push("You must fill in all fields.");
    }
  }

  get username() {
    return this.registerForm.get('username');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get passwordConfirmation() {
    return this.registerForm.get('passwordConfirmation');
  }

  private validateFormFieldExistsAndNotEmpty(field: any) {
    if (!field) {
      console.log("Field: ", field)
      return false;
    }
    if (!field.value) {
      console.log("Field value: ", field.value)
      return false;
    }
    if (field.value == "") {
      console.log("Field value empty: ", field.value)
      return false;
    }
    return true;
  }

}
