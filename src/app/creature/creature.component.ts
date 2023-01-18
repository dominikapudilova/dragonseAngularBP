import {AfterViewChecked, AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {CreatureService} from "../services/creature.service";
import {ActivatedRoute, Router} from "@angular/router";
import {faAngleLeft, faAngleRight, faArrowLeft, faPen, faTriangleExclamation} from "@fortawesome/free-solid-svg-icons";
import {Utils} from "../shared/utils";
import {ErrorService} from "../shared/error-service";
import {TimerService} from "../services/timer.service";
import {Subscription} from "rxjs";
import {PushService} from "../services/push.service";

@Component({
  selector: 'app-creature',
  templateUrl: './creature.component.html',
  styleUrls: ['./creature.component.css']
})
export class CreatureComponent implements OnInit, OnDestroy, AfterViewChecked {

  faArrowLeft = faArrowLeft;
  faAngleLeft = faAngleLeft;
  faAngleRight = faAngleRight;
  faPen = faPen;
  faTriangleExclamation = faTriangleExclamation;

  renaming: boolean = false;

  generalInfo: Array<any> = [];
  otherStats: Array<any> = [];
  skills: Array<any> = [];

  id: number = 0;
  creature: any;
  isEgg: boolean = false;

  nextId: number = 0;
  prevId: number = 0;

  availableAt: Date = new Date();
  availableIn: number = 0;
  timerSubscription?: Subscription;

  errorMessages: Array<string> = [];
  renderLoaders: boolean = true;

  constructor(private route: ActivatedRoute, private router: Router, private creatureService: CreatureService, private pushService: PushService) {}

  ngOnInit(): void {
    //subscribe to url to get notified when switched to another creature detail page
    this.route.paramMap.subscribe((params) => {
      if (params.has('id')) {
        this.id = parseInt(<string>params.get('id'));
      } else {
        this.id = 0;
      }
      if (this.id > 0) {
        //get creature data
        this.creatureService.getCreatureById(this.id).then(
          (creature) => {
            this.creature = creature;
            this.creature.id = this.id;
            this.isEgg = Boolean(!this.creature.hatched);
            if (this.isEgg) {
              this.router.navigate(["/egg", this.id]);
              return;
            }

            this.availableAt = new Date(this.creature['unavailable_until']);

            this.prepareGeneralInfo();
            this.prepareCreatureInformation();

            //get next and previous creatures for left/right arrows if more than one creature owned
            this.creatureService.getNextAndPreviousCreatures(this.id).then(
              (res: any) => {
                if (res && res['next'] && res['previous']) {
                  this.nextId = res['next'];
                  this.prevId = res['previous'];
                }
              }, (error) => {}
            );


            //reset variables related to previous creature
            this.errorMessages = [];
            this.availableIn = 0;
            this.timerSubscription?.unsubscribe();
          },
          (error) => {
            if (error.error.success === false) {
              let message = ErrorService.getErrorMessage(error);
              this.addMessage(message);
            }
          }
        );
      }
    });
  }

  //to unsubscribe from timer
  ngOnDestroy() {
    this.timerSubscription?.unsubscribe();
  }

  //to reload round progress bars, but only if this.renderLoaders == true
  ngAfterViewChecked() {
    if (this.otherStats.length > 0 && this.renderLoaders) {
      for (const stat of this.otherStats) {
        let renderValue = stat.title == "Luck" ? (stat.value * 10 + stat.added) : stat.value; //if luck, render value as value * 10 (2 => 20)
        this.renderLoaders = !this.renderProgress(renderValue, 'loader-' + stat.title);
      }
    }
  }

  //can be reused to refresh stats
  prepareCreatureInformation() {
    this.creatureService.getCreatureStats(this.id).then(
      (res: any) => {
        this.prepareOtherStats(res);
        this.prepareSkills(res);
        this.renderLoaders = true; //render changes in round loaders
      }, (error) => { this.addMessage(ErrorService.MSG_STATS_NOT_LOADED); }
    )
  }

  prepareGeneralInfo() {
    if (this.creature) {
      this.generalInfo = [];
      this.generalInfo.push({title: "Element", value: (this.creature['element_name'])});
      this.generalInfo.push({title: "Breed", value: this.creature['breed_name']});
      this.generalInfo.push({title: "Skin", value: this.creature['skin_name']});
      this.generalInfo.push({title: "Gender", value: Utils.getGenderTitle(this.creature['gender'])});

      const age = TimerService.getDaysAndHoursOld(this.creature['created_at']);
      const ageFormatted = age.days + " days, " + age.hours + " hours";
      this.generalInfo.push({title: "Age", value: ageFormatted});
    }
  }

  prepareOtherStats(creatureData: any) {
    if (this.creature) {
      if (typeof creatureData['energy'] == "undefined" ||
        typeof creatureData['health'] == "undefined" ||
        typeof creatureData['base_luck'] == "undefined") {
        this.addMessage(ErrorService.MSG_STATS_NOT_LOADED);
      }
      this.otherStats = [];
      //energy, health, luck

      this.otherStats.push({title: "Energy", value: creatureData['energy']});
      this.otherStats.push({title: "Health", value: creatureData['health']});
      this.otherStats.push({title: "Luck", value: creatureData['base_luck'], added: creatureData['added_luck']});
    }
  }

  prepareSkills(creatureData: any) {
    if (this.creature) {
      this.skills = [];
      //strength, defence, intelligence, speed
      let skills = ["Strength", "Defence", "Intelligence", "Speed"];

      for (const skill of skills) {
        let statBase = creatureData['base_' + skill.toLowerCase()];
        let statTrained = creatureData['trained_' + skill.toLowerCase()];
        let statCapCoef = 0;
        if (skill == "Speed") {
          statCapCoef = creatureData['speed_training_cap'];
        } else {
          statCapCoef = creatureData['stat_training_cap'];
        }
        let statMax = statBase + (statBase * statCapCoef);

        this.skills.push({title: skill, base: statBase, trained: statTrained, max: statMax});
      }
      // this.skills.push({title: "Strength", base: creatureData['base_strength'], trained: creatureData['trained_strength']});
      // this.skills.push({title: "Defence", base: creatureData['base_defence'], trained: creatureData['trained_defence']});
      // this.skills.push({title: "Intelligence", base: creatureData['base_intelligence'], trained: creatureData['trained_intelligence']});
      // this.skills.push({title: "Speed", base: creatureData['base_speed'], trained: creatureData['trained_speed']});
    }
  }

  getAvailable() {
    if (isNaN(this.availableAt.getTime()) || this.availableAt <= new Date()) {
      return true;
    }

    // if (this.availableIn <= 0) {
    if (!this.timerSubscription || this.timerSubscription?.closed) {
      //if not available and no countdown, start timer
      let timer = TimerService.start(this.availableAt.toUTCString());
      this.timerSubscription = timer.subscribe({
        next: (secondsLeft: number) => { this.availableIn = secondsLeft; },
        complete: () => {
          //reset timers
          this.availableIn = 0;
          this.availableAt = new Date();

          //check rewards?
          this.pushService.pushClaimableRewards();
        }
      });
    }
    return false;
  }

  setAvailableAt(availableAt: string) {
    this.availableAt = new Date(availableAt);

    //trigger counter
    this.getAvailable();
  }

  getRemainingTime() {
    return TimerService.getRemainingTimeFormatted(this.availableIn);
  }

  round(num: number) {
    return Math.round(num * 100) / 100;
  }

  addMessage(message: string) {
    if (!this.errorMessages.includes(message)) {
      this.errorMessages.push(message);
    } //todo make into objects: {status: 404, type: 'warning' | 'error', message: 'ddddd'}
  }

  rename(newName: string) {
    let oldName = this.creature.name;
    if (oldName != newName && newName.length > 0) {
      this.creature.name = newName;

      //send request to save
      this.creatureService.renameCreature(this.id, newName).then(
        (res: any) => {
          if (res.success !== true) {
            this.addMessage(ErrorService.MSG_CANNOT_RENAME);
            this.creature.name = oldName;
          }
        }, (error) => {
          let message = ErrorService.getErrorMessage(error);
          this.addMessage(ErrorService.MSG_CANNOT_RENAME + " " + message);
          this.creature.name = oldName; //rollback name
        }
      )
    }
  }

  private renderProgress(progress: number, id: string) {
    let element = document.getElementById(id);
    if (!element) {
      return false;
    }

    let angle = -90;
    progress = Math.floor(progress);
    if(progress<25){
      angle += (progress/100)*360;

      this.applyRotationToChildren(element, ".animate-0-25-b", angle); // $(element).find(".animate-0-25-b").css("transform","rotate("+angle+"deg)");
    }
    else if(progress>=25 && progress<50){
      angle += ((progress-25)/100)*360;

      this.applyRotationToChildren(element, ".animate-0-25-b", 0); // $(element).find(".animate-0-25-b").css("transform","rotate(0deg)");
      this.applyRotationToChildren(element, ".animate-25-50-b", angle); // $(element).find(".animate-25-50-b").css("transform","rotate("+angle+"deg)");
    }
    else if(progress>=50 && progress<75){
      angle += ((progress-50)/100)*360;

      this.applyRotationToChildren(element, ".animate-25-50-b, .animate-0-25-b", 0); // $(element).find(".animate-25-50-b, .animate-0-25-b").css("transform","rotate(0deg)");
      this.applyRotationToChildren(element, ".animate-50-75-b", angle); // $(element).find(".animate-50-75-b").css("transform","rotate("+angle+"deg)");
    }
    else if(progress>=75 && progress<=100){
      angle += ((progress-75)/100)*360;

      this.applyRotationToChildren(element, ".animate-50-75-b, .animate-25-50-b, .animate-0-25-b", 0); // $(element).find(".animate-50-75-b, .animate-25-50-b, .animate-0-25-b").css("transform","rotate(0deg)");
      this.applyRotationToChildren(element, ".animate-75-100-b", angle); // $(element).find(".animate-75-100-b").css("transform","rotate("+angle+"deg)");
    }

    return true;
  }

  private applyRotationToChildren(parent: Element, selector: string, angle: number) {
    let children = parent.querySelectorAll<HTMLElement>(selector);
    for (let i = 0; i < children.length; i++) {
      children[i].style.transform = "rotate(" + angle + "deg)";
    }
  }
}
