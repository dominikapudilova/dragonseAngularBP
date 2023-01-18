import {Component, Input, OnInit} from '@angular/core';
import { faUserGear, faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./../navbar.component.css', './nav-right.component.css']
})
export class NavRightComponent implements OnInit {

  menuItems = [
    {title: "Account", icon: faUserGear, route: "account"},
    {title: "Logout", icon: faArrowRightFromBracket, route: ""}
  ];

  @Input('menuCollapsed') menuCollapsed!: boolean;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']); //route to Home
  }

}
