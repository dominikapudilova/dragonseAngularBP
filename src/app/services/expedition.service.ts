import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { AuthService } from "./auth.service";
import {firstValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ExpeditionService {

  /*fetches expedition data, can also start a new expedition*/

  constructor(private http: HttpClient) {
  }

  getClosestExpedition() {
    return firstValueFrom(this.http.get(environment.API_URL + "expedition/closest"));
  }

  getExpeditionsByElement(elementId: number) {
    let query = "?elementId=" + elementId;
    return firstValueFrom(this.http.get(environment.API_URL + "expedition/" + query));
  }

  getExpeditionLengths() {
    return firstValueFrom(this.http.get(environment.API_URL + "expedition/lengths"));
  }

  sendOnExpedition(creatureId: number, expeditionId: number, length: number) {
    let requestData = {creatureId: creatureId, length: length};
    return firstValueFrom(this.http.patch(environment.API_URL + "expedition/" + expeditionId, requestData));
  }
}
