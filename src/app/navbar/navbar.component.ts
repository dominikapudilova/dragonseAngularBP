import {Component, OnInit} from '@angular/core';
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
    this.authInterceptor.loggedIn
      .pipe(
        mergeMap((loggedIn) => {
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
      }
    });

    this.pushService.balance().subscribe({
      next: value => {
        if (value === true) {
          this.assignCurrencyAmount();
        }
      }
    });
  }

  ngOnInit(): void {
  }

  private async assignCurrencyAmount() {
    this.goldAmount = await this.resourceService.getResourceAmountById(resources.ID_GOLD);
    this.coinsAmount = await this.resourceService.getResourceAmountById(resources.ID_COIN);
  }

}
