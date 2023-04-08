import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {faEgg, faWandSparkles} from "@fortawesome/free-solid-svg-icons";
import {CreatureService} from "../services/creature.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-hatchery',
  templateUrl: './hatchery.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./../stables/creature-card/creature-card.component.css', './../stables/stables.component.css','./hatchery.component.css']
})
export class HatcheryComponent implements OnInit {

  faEgg = faEgg;
  faWandSparkles = faWandSparkles;

  eggsWaiting: Array<any> = [];
  eggsIncubating: Array<any> = [];

  previousEgg: number = 0;

  constructor(private creatureService: CreatureService, private router: Router) {
    //if redirected from existing incubating egg, highlight by ID
    let id = this.router.getCurrentNavigation()?.previousNavigation?.finalUrl?.root?.children['primary']?.segments[1]?.path;
    if (id) {
      this.previousEgg = Number(id);
    }
  }

  ngOnInit(): void {
    this.creatureService.getEggs().then(
      (eggs: any) => {
        if (!eggs) { return; }
        for (let i = 0; i < eggs.length; i++) {
          if ((typeof eggs[i]['hatched_at'] == "undefined")) {
            return; //"Inconsistent data received from server."
          }
          let hatchedAt = new Date(eggs[i]['hatched_at']);
          if (isNaN(hatchedAt.getTime())) {
            //this is invalid date, meaning we received "0000-00-00 00:00:00" -> waiting for incubation
            this.eggsWaiting.push(eggs[i]);
          } else {
            this.eggsIncubating.push(eggs[i]);
            this.setRemainingTimeForEgg(eggs[i]['id']);
          }
        }
        this.highlightIncubatingEgg(this.previousEgg);
      }, () => {} //catch 400 & 500 responses
    );

  }

  hatch(eggId: string) {
    let id = Number(eggId);
    this.creatureService.hatchEgg(id).then(
      (res: any) => {
        if (res.success === true) {
          //creature hatched -> redirect
          this.router.navigate(["/creature", id]);
        }
      }/*, (error) => {
      }*/
    )
  }

  private setRemainingTimeForEgg(eggId: number) {
    let egg = this.eggsIncubating.find(({ id }) => id === eggId);
    if (egg) { egg.remainingSecs = Math.floor((new Date(egg['hatched_at']).getTime() - new Date().getTime()) / 1000); } //millis to secs
  }

  private highlightIncubatingEgg(eggId: number) {
    let egg = this.eggsIncubating.find(({ id }) => id === eggId);
    if (egg) { egg.highlight = true; }
  }
}
