import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  /*UserService takes care of User related operations.*/
  /*Create new User, update User password, update icon, get user*/
  constructor(private http: HttpClient) { }

  getUserById(userId: number) {
    return this.http.get(environment.API_URL + "user/" + userId);
  }
}
