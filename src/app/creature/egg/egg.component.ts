import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {CreatureService} from "../../services/creature.service";
import {TimerService} from "../../services/timer.service";
import {faChevronUp, faWandSparkles} from "@fortawesome/free-solid-svg-icons";
import {ResourceService} from "../../services/resource.service";
import {ErrorService} from "../../shared/error-service";

@Component({
  selector: 'egg-view',
  templateUrl: './egg.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./egg.component.css']
})
export class EggComponent implements OnInit {
  faWandSparkles = faWandSparkles;
  faChevronUp = faChevronUp;

  id: number = 0;
  creature: any;

  parentFather: any;
  parentMother: any;

  incubationGems: Array<any> = [];
  incubationPeriod: number = 0;
  totalTimeDecrease: number = 0;
  incubationTimeRemaining: number = 0;

  generalInfo: Array<any> = [];
  errorMessagesGems: Array<any> = [];
  errorMessagesGeneral: Array<any> = [];

  constructor(private route: ActivatedRoute, private router: Router, private creatureService: CreatureService, private resourceService: ResourceService) {
    //no switching between creatures, so route snapshot is fine
    this.id = parseInt(<string>this.route.snapshot.paramMap.get('id'));

    this.creatureService.getCreatureById(this.id).then(
      (creature) => {
        this.creature = creature;
        this.creature.id = this.id;
        let isEgg = Boolean(!this.creature.hatched);

        if (!isEgg) {
          this.router.navigate(["/creature", this.id]);
          return;
        }

        let isIncubating = !isNaN(new Date(this.creature['hatched_at']).getTime());
        if (isIncubating) {
          this.router.navigate(["/hatchery"]);//, { queryParams: {highlightEgg: this.id} }
          return;
        }

        //load gems
        this.loadIncubationGems();

        //get total incubation time
        this.creatureService.getIncubationTime().then(
          (incubationPeriod: number) => {
            this.incubationPeriod = incubationPeriod;
            this.updateIncubationTime();
          }
        );

        this.prepareGeneralInfo(); //could be moved to rollup
      }, (error) => {
        this.addErrorMessage(ErrorService.getErrorMessage(error), this.errorMessagesGeneral);
      }
    );
  }

  ngOnInit(): void {
  }

  prepareGeneralInfo() {
    if (this.creature) {// && this.generalInfo.length <= 0
      this.generalInfo.push({title: "Element", value: (this.creature['element_name'])});
      this.generalInfo.push({title: "Breed", value: this.creature['breed_name']});
      this.generalInfo.push({title: "Skin", value: "?"});
      this.generalInfo.push({title: "Gender", value: "?"});

      const age = TimerService.getDaysAndHoursOld(this.creature['created_at']);
      const ageFormatted = age.days + " days, " + age.hours + " hours";
      this.generalInfo.push({title: "Age", value: ageFormatted});
    }
  }

  loadParents() {
    if (!this.parentFather || !this.parentMother) {
      this.creatureService.getParents(this.id).then(
        (parents: any) => {
          this.parentFather = parents.father;
          this.parentMother = parents.mother;
        });
    }
  }

  loadIncubationGems() {
    this.resourceService.getIncubationGems(this.creature['element_id']).then(
      (gems: any) => {
        this.incubationGems = [];
        for (const id in gems) {
          let gemId = Number(id);
          this.incubationGems.push({
            id: gemId,
            title: gems[gemId].name,
            rarity: gems[gemId].rarity,
            timeDecrease: Number(gems[gemId]['time_decrease']),
            amount: 0,
            given: 0
          });

          this.loadGemAmount(gemId);
        }

        //sort by rarity
        this.incubationGems.sort((a: any, b: any) => a.rarity - b.rarity);
      }
    )
  }

  change(gemId: number, delta: number) {
    let gem = this.incubationGems.find(({ id }) => id === gemId);

    if (delta > 0) { this.inc(gem); }
    else { this.dec(gem); }

    this.setTotalTimeDecrease(this.getTotalTimeDecrease());
    this.updateIncubationTime();
  }


  incubate() {
    if (this.sumAllGivenGems() < 10) {
      let legendaryGem = this.incubationGems.find(({ rarity }) => rarity === 5); //magic number for rare gem
      if (legendaryGem.given != 1) {
        this.addErrorMessage("You must give either 10 gems or one legendary gem to start incubation!", this.errorMessagesGems);
        return;
      }
    }

    //prepare array for request body
    let givenGems = [];
    for (let i = 0; i < this.incubationGems.length; i++) {
      if (this.incubationGems[i].given > 0) {
        givenGems.push({id: this.incubationGems[i].id, amount: this.incubationGems[i].given});
      }
    }

    //send incubation request
    this.creatureService.incubateCreature(this.id, givenGems).then(
      (res: any) => {
        if (res.success === true) {
          this.router.navigate(["/hatchery"]);
        }
      }, (error) => {
        if (error.error.success === false) {
          let message = ErrorService.getErrorMessage(error);
          this.addErrorMessage(message, this.errorMessagesGeneral);
        }
      }
    );
  }

  private loadGemAmount(resourceId: number) {
    this.resourceService.getResourceAmountById(resourceId).then(
      amount => {
        let currentResource = this.incubationGems.find(({ id }) => id === resourceId);
        currentResource.amount = amount;
      }
    );
  }

  private dec(gem: any) {
    if (gem.given > 0) {
      gem.given--;
    }
  }

  private inc(gem: any) {
    //check total amount of gems
    let totalSum = this.sumAllGivenGems();
    if (totalSum >= 10) {
      return;
    }

    //check that total decrease doesn't exceed 100%
    let totalDecrease = this.getTotalTimeDecrease();
    if ((totalDecrease + gem.timeDecrease) > 100) {
      return;
    }

    if (gem.given < gem.amount) {
      gem.given++;
    }
  }

  private sumAllGivenGems() {
    let sum = 0;
    for (let i = 0; i < this.incubationGems.length; i++) {
      sum += this.incubationGems[i].given;
    }
    return sum;
  }

  private getTotalTimeDecrease() {
    let decrease = 0;
    for (let i = 0; i < this.incubationGems.length; i++) {
      decrease += this.incubationGems[i].given * this.incubationGems[i].timeDecrease;
    }
    return decrease;
  }

  private setTotalTimeDecrease(value: number) {
    this.totalTimeDecrease = value;
  }

  private updateIncubationTime() {
    this.incubationTimeRemaining = this.incubationPeriod - (this.incubationPeriod / 100 * this.totalTimeDecrease);
  }

  private addErrorMessage(message: string, messageArray: any) {
    if (!messageArray.includes(message)) {
      messageArray.push(message);
    }
  }
}
