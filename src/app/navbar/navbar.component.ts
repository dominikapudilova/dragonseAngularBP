import {Component, DoCheck, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import { mergeMap, Observable} from "rxjs";
import {User} from "../models/user";
import {ResourceService} from "../services/resource.service";
import {resources} from "../shared/const-resource";
import {AuthHeaderInterceptor} from "../services/auth-header.interceptor";
import {PushService} from "../services/push.service";

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  /*Must know about logged user, his username, icon*/
  /*decides if navbars will have content based on logged in/out*/

  loggedIn: boolean = false;
  username: string = "";
  userPfp: string = "";
  coinsAmount: number = 0;
  goldAmount: number = 0;

  rightMenuCollapsed: boolean = true;

  constructor(private authService: AuthService, private resourceService: ResourceService, private pushService: PushService, private authInterceptor: AuthHeaderInterceptor) {
    // this.authService.loggedIn
    this.authInterceptor.loggedIn
      .pipe(
        mergeMap((loggedIn) => {
      // .subscribe((loggedIn) => {
          this.loggedIn = loggedIn;
          if (this.loggedIn) {
            return this.authService.user;
          }
          return new Observable<User>;
        }))
      .subscribe({
      next: (user) => {
        //load user
        this.username = user.name;
        this.userPfp = user.profilePic;

        // if (this.loggedIn) {
        //   //load resources
        //   console.log("Updating resources");
        //   this.assignResourceAmount("gold", resources.ID_GOLD);
        //   this.assignResourceAmount("coin", resources.ID_COIN);
        //   console.log("gold: " + this.goldAmount);
        // }
      }
    });

    this.pushService.balance().subscribe({
      next: value => {
        if (value === true) {
          this.assignCurrencyAmount();
        }
      }
    });

    /*this.authService.loggedIn
      .pipe(
        switchMap((loggedIn, index) => {
          this.loggedIn = loggedIn;
          if (this.loggedIn) {
            console.log("logged in, requestin usera")
            return this.authService.user;
          }
          console.log("vracim empty usera, neni logged in");
          return new Observable<User>();
        }))
      .subscribe({
        next: (user) => {
          console.log("stahuji usera z authservice.user");
          this.username = user.name;
          this.userPfp = user.profilePic;
        }
      });*/
    /*this.authService.loggedIn.subscribe({
      next: (loggedIn) => {
        this.loggedIn = loggedIn;

        if (loggedIn) {
          this.username = this.authService.user.name;
          this.userPfp = this.authService.user.profilePic;

        } else {
          this.username = "";
          this.userPfp = "";
        }
      }
    });*/
    /*this.resourceService.getResourceById(resources.ID_GOLD, this.authService.authHeaders).pipe(take(1)).subscribe({
      next: (res: any) => {
        if (res['resource_id'] == resources.ID_GOLD) {
          this.goldAmount = res['amount'];
        } else {
          throw new Error("Wrong resource was pulled!");
        }
      }
    });*/
  }

  ngOnInit(): void {
  }

  /*ngDoCheck() {
    //todo add max try count
    // if (this.authInterceptor.getLoggedIn() && (this.goldAmount == 0) ) { //todo necheckovat na 0. user muze mit 0 goldu
    // if (this.loggedIn && (this.goldAmount == 0) ) { //todo necheckovat na 0. user muze mit 0 goldu
    // if (this.resourcesRequested == false) {

      // this.assignResourceAmount("gold", resources.ID_GOLD);
      // this.assignResourceAmount("coin", resources.ID_COIN);

      // this.assignCurrencyAmount();
      // this.resourcesRequested = true;

    // }
  }*/

  private async assignCurrencyAmount() {
    this.goldAmount = await this.resourceService.getResourceAmountById(resources.ID_GOLD);
    this.coinsAmount = await this.resourceService.getResourceAmountById(resources.ID_COIN);
  }

  /*private assignResourceAmount(resource: string, resourceId: number) {//todo refactor: make async, return amount, assign in main, not here
    this.resourceService.getResourceAmountById(resourceId).then((amount) => {
      switch (resource) { //todo lepší řešení?
        case "gold":
          this.goldAmount = amount;
          break;
        case "coin":
          this.coinsAmount = amount;
          break;
      }
    });
  }*/

}
