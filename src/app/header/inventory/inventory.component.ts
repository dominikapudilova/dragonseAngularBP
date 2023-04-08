import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ResourceService} from "../../services/resource.service";
import {AuthService} from "../../services/auth.service";
import {resources} from "../../shared/const-resource";
import {faGem} from '@fortawesome/free-solid-svg-icons';
import {PushService} from "../../services/push.service";

@Component({
  selector: 'header-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit, OnChanges {

  @Input('inventoryCollapsed') inventoryCollapsed!: boolean;
  resourceCollection: Array<any> = [];
  faGem = faGem;

  resourcesLoaded: boolean = false;

  constructor(private authService: AuthService, private pushService: PushService, private resourceService: ResourceService) {
    this.pushService.resource().subscribe({
      next: resourceId => {
        //todo: value could actually be resource id, then we load only the new resources
        if (resourceId > 0) {
          if (this.resourcesLoaded) { //if inventory has been already once opened
            this.loadItemAmount(resourceId);
          }
        }
      }
    })
  }

  ngOnInit(): void {
    this.loadInventory();
  }

  /*Loads resource amounts upon opening inventory for the first time*/
  ngOnChanges(changes: SimpleChanges): void {
    let inventoryCollapsedChange = changes['inventoryCollapsed'];
    if (!inventoryCollapsedChange) { return; }
    if (!inventoryCollapsedChange.currentValue && !this.resourcesLoaded) {//this.resourceCollection.length <= 0

      this.loadAllItemsAmounts();
      this.resourcesLoaded = true;
    }
  }

  /*Gets all inventory items except gold and coins, sorts alphabetically and prepares array of resources*/
  private loadInventory() {
    this.resourceService.getAllResources().then(
      (res: any) => {
        res.sort((a: any, b: any) => a.code.localeCompare(b.code));
        for (let i = 0; i < res.length; i++) {
          let resource = res[i];
          if (resource.id != resources.ID_GOLD && resource.id != resources.ID_COIN) { //manually skip gold and coins
            this.resourceCollection.push({id: resource.id, name: resource.name, amount: 0, icon: faGem});
          }
        }
      }
    );
  }

  private loadAllItemsAmounts() {
    for (let i = 0; i < this.resourceCollection.length; i++) {
      this.loadItemAmount(this.resourceCollection[i].id);
    }
  }

  /*Get item amount and assign to appropriate object in resource array*/
  private loadItemAmount(resourceId: number) {
    this.resourceService.getResourceAmountById(resourceId).then(
      amount => {
        let currentResource = this.resourceCollection.find(({ id }) => id === resourceId);
        currentResource.amount = amount;
      }
    );
  }

}
