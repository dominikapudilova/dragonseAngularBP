import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input('username') username?: string;
  @Input('display') display?: boolean = true;

  inventoryCollapsed: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  /*toggleInventoryCollapse() {
    this.inventoryCollapsed = !this.inventoryCollapsed;
  }*/

}
