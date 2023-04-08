import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { faGenderless } from "@fortawesome/free-solid-svg-icons";
import {CreatureService} from "../../services/creature.service";
import {TimerService} from "../../services/timer.service";
import {Utils} from "../../shared/utils";
import {PushService} from "../../services/push.service";

@Component({
  selector: 'creature-card',
  templateUrl: './creature-card.component.html',
  styleUrls: ['./../stables.component.css','./creature-card.component.css']
})
export class CreatureCardComponent implements OnInit, OnChanges {

  /*Represents a single creature in card view. Needs: id, name, imgurl, gender, available*/

  @Input('creature') creature: any = null;
  available: boolean = true;
  availableAt: Date = new Date();
  availableIn: number = 0;

  genderIcon = faGenderless;

  constructor(private creatureService: CreatureService, private pushService: PushService) {}

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    //when creature supplied to component, check its availability
    if (changes['creature']) {
      this.getAvailable();
      //get available straight from request getAllCreatures()
    }
  }

  getGenderIcon() {
    this.genderIcon = Utils.getGenderIcon(this.creature.gender);
    return this.genderIcon;
  }

  getAvailable() {
    this.creatureService.getCreatureAvailable(this.creature.id).then(
      (available) => {
        this.available = available;

        //if unavailable, start timer to countdown until back available. then repeat request
        if (!available) {
          this.creatureService.getCreatureAvailableAt(this.creature.id).then(
            (availableAt: string) => {
              let timer = TimerService.start(availableAt);
              timer.subscribe({
                next: (secondsLeft: number) => { this.availableIn = secondsLeft; },
                complete: () => {
                  //check available again
                  this.availableIn = 0;
                  this.getAvailable();

                  //check rewards
                  this.pushService.pushClaimableRewards();
                }
              });
            }
          );
        }
      }
    );
  }
}
