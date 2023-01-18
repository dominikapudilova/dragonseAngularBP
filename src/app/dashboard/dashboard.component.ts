import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";
import {User} from "../models/user";
import {firstValueFrom} from "rxjs";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: any;//User;

  constructor(private route: ActivatedRoute, private authService: AuthService) {
    // console.log("RESOLVER RESULT: ");
    // console.log(this.route.snapshot.data['loggedIn']);
    // this.user = authService.user;
    // this.user = {};
    // this.user.name = "unga bunga";

    //first value contains username, id. That's enough
    firstValueFrom(this.authService.user).then((user) => {
      this.user = user;
    });
  }

  ngOnInit(): void {
    // console.log(this.route.snapshot.data);
    // console.log("TED NGONINIT");
  }

}
