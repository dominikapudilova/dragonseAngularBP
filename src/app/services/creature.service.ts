import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {firstValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CreatureService {

  constructor(private http: HttpClient) { }

  getAllCreatures() {
    return this.http.get(environment.API_URL + "creature");
  }

  async getEggs() {
    return await firstValueFrom(this.http.get(environment.API_URL + "creature/eggs"));
  }

  //get simple values
  async getIncubationTime() : Promise<number> {
    let incubationTime: any = await firstValueFrom(this.http.get(environment.API_URL + "creature/incubationTime"));
    return incubationTime['incubation_time'];
  }

  async getCreatureAvailable(creatureId: number) : Promise<boolean> {
    let available: any = await firstValueFrom(this.http.get(environment.API_URL + "creature/" + creatureId + "/available"));
    return available['available'];
  }

  async getCreatureAvailableAt(creatureId: number) : Promise<string> {
    let availableAt: any = await firstValueFrom(this.http.get(environment.API_URL + "creature/" + creatureId + "/availableAt"));
    return availableAt['available_at'];
  }

  async getCreaturePettable(creatureId: number) : Promise<boolean> {
    let pettable: any = await firstValueFrom(this.http.get(environment.API_URL + "creature/" + creatureId + "/pettable"));
    return pettable['pettable'];
  }

  async getSellPrice(creatureId: number) {
    let sellPrice: any = await firstValueFrom(this.http.get(environment.API_URL + "creature/" + creatureId + "/sellPrice"));
    return sellPrice['sellPrice'];
  }

  //get Object
  async getCreatureById(creatureId: number) {
    return await firstValueFrom(this.http.get(environment.API_URL + "creature/" + creatureId));
  }

  async getCreatureStats(creatureId: number) {
    return await firstValueFrom(this.http.get(environment.API_URL + "creature/" + creatureId + "/stats"));
  }

  async getNextAndPreviousCreatures(creatureId: number) {
    return await firstValueFrom(this.http.get(environment.API_URL + "creature/" + creatureId + "/nextAndPrevious"));
  }

  async getMates(creatureId: number) {
    return await firstValueFrom(this.http.get(environment.API_URL + "creature/" + creatureId + "/mates"));
  }

  async getParents(creatureId: number) {
    return await firstValueFrom(this.http.get(environment.API_URL + "creature/" + creatureId + "/parents"));
  }

  //actions
  async trainCreature(creatureId: number, skill: string) {
    let requestData = {skill: skill};
    return await firstValueFrom(this.http.patch(environment.API_URL + "creature/" + creatureId + "/train", requestData)); //?action=train
  }

  async petCreature(creatureId: number) {
    return await firstValueFrom(this.http.patch(environment.API_URL + "creature/" + creatureId + "/pet", {}));
  }

  async restCreature(creatureId: number, length: number) {
    let requestData = {length: length};
    return await firstValueFrom(this.http.patch(environment.API_URL + "creature/" + creatureId + "/rest", requestData));
  }

  async breedCreature(creatureId: number, mateId: number) {
    let requestData = {mateId: mateId};
    return await firstValueFrom(this.http.patch(environment.API_URL + "creature/" + creatureId + "/breed", requestData));
  }

  async sellCreature(creatureId: number) {
    return await firstValueFrom(this.http.patch(environment.API_URL + "creature/" + creatureId + "/sell", {}));
  }

  async incubateCreature(creatureId: number, gems: any) {
    return await firstValueFrom(this.http.patch(environment.API_URL + "creature/" + creatureId + "/incubate", gems));
  }

  async hatchEgg(creatureId: number) {
    return await firstValueFrom(this.http.patch(environment.API_URL + "creature/" + creatureId + "/hatch", {}));
  }

  async renameCreature(creatureId: number, newName: string) {
    let requestData = {newName: newName};
    return await firstValueFrom(this.http.patch(environment.API_URL + "creature/" + creatureId + "/rename", requestData));
  }




}
