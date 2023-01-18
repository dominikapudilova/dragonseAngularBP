import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { faGear, faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'nav-top',
  templateUrl: './nav-top.component.html',
  styleUrls: ['./../navbar.component.css','./nav-top.component.css']
})
export class NavTopComponent implements OnInit {

  /*needs to know: username, user PFP, user gold, user coins*/
  /*should get all from navbar.component*/

  @Input('username') username: string = "";
  @Input('userPfp') userPfp: string = "";
  @Input('coinsAmount') coinsAmount: number = 0;
  @Input('goldAmount') goldAmount: number = 856;

  @Input('rightMenuCollapsed') rightMenuCollapsed!: boolean;
  @Output() rightMenuCollapsedChange = new EventEmitter<boolean>();

  faGear = faGear;
  faPlus = faPlus;

  constructor() { }

  ngOnInit(): void {

  }

  collapse() {
    this.rightMenuCollapsed = !this.rightMenuCollapsed;
    this.rightMenuCollapsedChange.emit(this.rightMenuCollapsed);
  }


}
