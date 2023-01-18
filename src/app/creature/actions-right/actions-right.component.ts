import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {faClock, faHandHoldingHeart, faHandLizard, faHeart, faMoon, faSkull} from "@fortawesome/free-solid-svg-icons";
import {CreatureService} from "../../services/creature.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ErrorService} from "../../shared/error-service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'detail-actions-right',
  templateUrl: './actions-right.component.html',
  styleUrls: ['./../creature.component.css', './actions-right.component.css']
})
export class ActionsRightComponent {

  faHandHoldingHeart = faHandHoldingHeart;
  faHandLizard = faHandLizard;
  faClock = faClock;
  faMoon = faMoon;
  faHeart = faHeart;
  faSkull = faSkull;

  mates: Array<any> | null = [];
  pettable: boolean = true;
  creaturePrice: number = 0;

  // @Input('creatureId') creatureId: number = 0;
  creatureId: number = 0;
  @Output() errorMessage = new EventEmitter<string>();
  @Output() availableAt = new EventEmitter<string>();
  @Output() reloadStats = new EventEmitter<boolean>();

  constructor(private route: ActivatedRoute, private router: Router, private creatureService: CreatureService, private modalService: NgbModal) {
    //subscribe to url to know when creature was changed - then request pettable
    this.route.paramMap.subscribe((params) => {
      if (params.has('id')) {
        this.creatureId = parseInt(<string>params.get('id'));
        this.checkPettable();

        //reset variables
        this.mates = [];
        this.creaturePrice = 0;
      }
    });
  }

  checkPettable() {
    this.creatureService.getCreaturePettable(this.creatureId).then(pettable => {
      this.pettable = pettable;
      if (this.pettable === false) {
        setTimeout(() => {
          this.checkPettable();
        }, (1000 * 60 * 2)) //check every two minutes to enable button
      }
    });
  }

  loadMates() {
    if (this.mates != null && this.creatureId > 0) {
      this.creatureService.getMates(this.creatureId).then((mates: any) => {
        if (mates) { this.mates = mates; }
        else { this.mates = null; }
      });
    }
  }

  pet() {
    if (this.creatureId > 0) {
      this.creatureService.petCreature(this.creatureId).then(
        (res: any) => {
          //for reporting 200 responses
          if (res.success === false) {
            this.errorMessage.emit(res.message);
          } else if (res.success === true) {
            //successfully pet
            this.checkPettable();
            //trigger reloading stats in creature component
            this.reloadStats.emit(true);
          }
        });
    }
  }

  rest(length: number) {
    this.creatureService.restCreature(this.creatureId, length).then(
      (res: any) => {
        if (res.success === true) {
          //successfully resting
          this.availableAt.emit(res['available_at']);
          this.reloadStats.emit(true);
        }
      },
      (error) => {
        if (error.error.success === false) {
          let message = ErrorService.getErrorMessage(error);
          this.errorMessage.emit(message);
        }
      }
    )
  }

  breed(mateIdVal: string) {
    let mateId = Number(mateIdVal);
    if (!mateId) {
      this.errorMessage.emit("You need to select a mate first!");
      return;
    }

    this.creatureService.breedCreature(this.creatureId, mateId).then(
      (res: any) => {
        if (res.success === true && res['offspring_id']) {
          this.router.navigate(['/creature', res['offspring_id']]);
        }
      }, (error) => {
        if (error.error.success === false) {
          let message = ErrorService.getErrorMessage(error);
          this.errorMessage.emit(message);
        }
      }
    );
  }

  openSellModal(modalContent: any) {
    if (this.creaturePrice <= 0) {
      this.creatureService.getSellPrice(this.creatureId).then(
        (sellPrice) => { this.creaturePrice = sellPrice; },
        () => { this.errorMessage.emit("Creature's price couldn't be calculated."); }
      );
    }
    this.openModal(modalContent).then((result) => {
      if (result === true) {
        //sell creature
        this.creatureService.sellCreature(this.creatureId).then(
          (res: any) => {
            if (res.success === true) {
              //trigger reload resources

              this.router.navigate(['/stables']); //navigate to stables
            }
          }, (error) => {
            if (error.error.success === false) {
              let message = ErrorService.getErrorMessage(error);
              this.errorMessage.emit(message);
            }
          }
        )
      }
    }, () => {});
  }

  openModal(modalContent: any) {
    return this.modalService.open(modalContent, {centered: true}).result;
  }
}
