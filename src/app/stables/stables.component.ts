import { Component, OnInit } from '@angular/core';
import {CreatureService} from "../services/creature.service";
import {Observable} from "rxjs";

@Component({
  selector: 'stables',
  templateUrl: './stables.component.html',
  styleUrls: ['./stables.component.css']
})
export class StablesComponent {

  creatureCollection$: Observable<any>;

  constructor(private creatureService: CreatureService) {
    this.creatureCollection$ = creatureService.getAllCreatures();
  }
}

