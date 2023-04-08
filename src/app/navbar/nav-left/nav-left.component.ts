import { Component, OnInit } from '@angular/core';
import { faDragon, faThLarge, faEgg, faStore, faTrophy, faScroll, faStar } from "@fortawesome/free-solid-svg-icons";
import {PushService} from "../../services/push.service";
import {ResourceService} from "../../services/resource.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {resources} from "../../shared/const-resource";

@Component({
  selector: 'nav-left',
  templateUrl: './nav-left.component.html',
  styleUrls: ['./../navbar.component.css', './nav-left.component.css']
})
export class NavLeftComponent implements OnInit {

  menuItems = [
    {title: "Dashboard", icon: faThLarge, route: "dashboard"},
    {title: "Stables", icon: faDragon, route: "stables"},
    {title: "Hatchery", icon: faEgg, route: "hatchery"},
    {title: "Animal store", icon: faStore, route: "store"},
    {title: "Achievements", icon: faTrophy, route: "achievements"},
    {title: "Wiki", icon: faScroll, route: "wiki"}
  ];

  faStar = faStar;
  rewardsClaimable: boolean = false;
  rewards: any = null;

  constructor(private pushService: PushService, private resourceService: ResourceService, private modalService: NgbModal) { }

  ngOnInit(): void {
    //asynchronously load claimable rewards
    this.pushService.claimableRewards().subscribe(
      {next: value => {
          if (value === true) { //received a push to check if new rewards are available
            this.resourceService.getRewards().then(
              (res: any) => {
                if (res == null || res?.success === false) {
                } else {
                  this.rewards = res;
                  this.rewardsClaimable = true;
                }
              }, () => {} //no place to show error for now
            );
          }
        }
      }
    )
  }

  openClaimModal(modalContent: any) {
    if (!this.rewardsClaimable) {
      return;
    }
    this.openModal(modalContent).then((result) => {
      if (result === true) {

        //claim rewards
        this.resourceService.claimRewards().then(
          (res: any) => {
            if (res.success === true) {
              this.rewardsClaimable = false; //claimed!
              this.pushService.pushCurrency(); //trigger currency refresh (gold and coins)

              //for each claimed resource
              if (res.resources) {
                for (const resourceId of res.resources) {
                  if (resourceId != resources.ID_GOLD && resourceId != resources.ID_COIN) { //these are currency
                    this.pushService.pushResource(resourceId); //trigger resource refresh
                  }
                }
              }
            }
          }, (error) => {}
        );
      }
    }, () => {});
  }

  private openModal(modalContent: any) {
    return this.modalService.open(modalContent, {centered: true, size: "xl"}).result;
  }

}
