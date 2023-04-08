import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PushService {

  private _pushClaimableRewards: BehaviorSubject<boolean> = new BehaviorSubject(true); //check claimable rewards always upon subscription
  private _pushCurrency: BehaviorSubject<boolean> = new BehaviorSubject(true); //refresh gold and coins amount
  private _pushResource: BehaviorSubject<number> = new BehaviorSubject(0); //refresh single resource amount upon subscription
  constructor() { }

  pushClaimableRewards() {
    this._pushClaimableRewards.next(true);
  }

  pushCurrency() {
    this._pushCurrency.next(true);
  }

  pushResource(resourceId: number) {
    this._pushResource.next(resourceId);
  }

  claimableRewards() {
    return this._pushClaimableRewards;
  }

  balance() {
    return this._pushCurrency;
  }

  resource() {
    return this._pushResource;
  }
}
