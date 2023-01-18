import { Component, OnInit } from '@angular/core';
import {ExpeditionService} from "../../services/expedition.service";
import {AuthService} from "../../services/auth.service";
import {firstValueFrom } from "rxjs";
import { faQuestion, faHourglass } from '@fortawesome/free-solid-svg-icons';
import {TimerService} from "../../services/timer.service";

@Component({
  selector: 'expedition-module',
  templateUrl: './expedition-module.component.html',
  styleUrls: ['./../dashboard.component.css', './expedition-module.component.css']
})
export class ExpeditionModuleComponent implements OnInit {

  faQuestion = faQuestion;
  faHourglass = faHourglass;

  closestExpedition: any = null;
  remainingTime: number = 0;

  constructor(private expeditionService: ExpeditionService) {

  }

  ngOnInit(): void {
    this.expeditionService.getClosestExpedition().then(
      (expedition: any) => {
        if (expedition) {
          this.closestExpedition = expedition;
          let timer = TimerService.start(this.closestExpedition['returning_at']);
          timer.subscribe({
            next: (secondsLeft: number) => {this.remainingTime = secondsLeft;},
            complete: () => {this.closestExpedition = null;}
          });
        }
      }
    );
  }

  getRemainingTime() {
    return TimerService.getRemainingTimeFormatted(this.remainingTime);
  }

}
