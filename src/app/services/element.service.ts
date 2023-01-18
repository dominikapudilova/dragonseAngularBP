import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {firstValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ElementService {

  constructor(private http: HttpClient) { }

  public async getAllElements() {
    return await firstValueFrom(this.http.get(environment.API_URL + "element"));
  }
}
