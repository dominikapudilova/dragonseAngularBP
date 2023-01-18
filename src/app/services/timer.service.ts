import { Injectable } from '@angular/core';
import {map, Observable, takeWhile, tap, timer} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  constructor() { }

  public static start(availableAt: string) : Observable<number> {
    let availableAtSeconds = new Date(availableAt).getTime();
    let nowSeconds = new Date().getTime();

    let remainingSeconds = Math.round((availableAtSeconds - nowSeconds) / 1000);
    if (remainingSeconds <= 0) { return new Observable<number>; }

    return timer(1000, 1000)
      .pipe(
        takeWhile( () => remainingSeconds > 0),
        tap(() => remainingSeconds = remainingSeconds - 1),
        map(() => remainingSeconds)
      );
    /*timer(1000, 1000) //Initial delay 1 seconds and interval countdown also 1 second
      .pipe(
        takeWhile( () => counter > 0 ),
        tap(() => counter--)
      )
      .subscribe( () => {
        console.log(counter);
      } );*/
  }

  public static getRemainingTimeFormatted(secondsLeft: number) : string {
    let hour = Math.floor(secondsLeft / (60*60));
    let min = Math.floor((secondsLeft - (hour * 60 * 60)) / 60);
    let sec = Math.floor(secondsLeft % 60);

    let hourStr: string = hour < 10 ? "0" + hour : hour.toString();
    let minStr: string = min < 10 ? "0" + min : min.toString();
    let secStr: string = sec < 10 ? "0" + sec : sec.toString();

    return hourStr + ":" + minStr + ":" + secStr;
  }

  public static getDaysAndHoursOld(createdAt: string) : {days: number, hours: number} {
    let birthday = new Date(createdAt);

    let millisOld = Math.abs(new Date().getTime() - birthday.getTime());
    let daysOld = Math.floor(millisOld / (1000 * 60 * 60 * 24));
    let hoursOld = Math.floor((millisOld % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return {days: daysOld, hours: hoursOld};
  }
}
