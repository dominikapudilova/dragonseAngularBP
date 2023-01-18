import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {firstValueFrom} from "rxjs";
import {HeaderComponent} from "../header/header.component";

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  /*Resource service makes request to get resource amount, change resource amount*/
  /*does not keep track of user resources*/

  constructor(private http: HttpClient) { }

  getAllResources() {
    return firstValueFrom(this.http.get(environment.API_URL + "resource"));
  }

  async getResourceAmountById(resourceId: number) {
    let resourceData: any = await firstValueFrom(this.http.get(environment.API_URL + "resource/" + resourceId));
    if (resourceData['resource_id'] == resourceId) {
      return resourceData['amount'];
    } else {
      throw new Error("Wrong resource was received.");
    }
  }

  async getIncubationGems(elementId: number) {
    return firstValueFrom(this.http.get(environment.API_URL + "resource/incubationGems?elementId=" + elementId));
  }

  async getRewards() {
    return firstValueFrom(this.http.get(environment.API_URL + "resource/delayedRewards"));
  }

  async claimRewards() { //todo: could claim one by one
    return firstValueFrom(this.http.patch(environment.API_URL + "resource/delayedRewards", {}));
  }

}
