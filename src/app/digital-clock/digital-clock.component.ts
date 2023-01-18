import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'digital-clock',
  templateUrl: './digital-clock.component.html',
  styleUrls: ['./digital-clock.component.css']
})
export class DigitalClockComponent implements OnInit, OnChanges {

  clock: {hours: any, mins: any} = {hours: "00", mins: "00"};

  @Input("remainingSecs") remainingSecs: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    //if input remainingSecs is changed, react and update clock
    if (changes['remainingSecs']) {
      this.updateClock();
    }
  }

  updateClock() {
    if (this.remainingSecs < 0) {
      this.clock = {hours: "00", mins: "00"};
      return;
    }

    //make remainingSecs into clock
    this.clock.hours = Math.floor(this.remainingSecs / 3600);
    this.remainingSecs %= 3600;
    this.clock.mins = Math.floor(this.remainingSecs / 60);

    //zerofill + convert to string
    this.clock.hours = this.clock.hours < 10 ? "0" + this.clock.hours : this.clock.hours.toString();
    this.clock.mins = this.clock.mins < 10 ? "0" + this.clock.mins : this.clock.mins.toString();
  }

}
