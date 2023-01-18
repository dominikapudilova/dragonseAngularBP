import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {faBolt, faBoltLightning, faBrain, faDumbbell, faHourglass, faShield} from "@fortawesome/free-solid-svg-icons";
import {ElementService} from "../../services/element.service";
import {Utils} from "../../shared/utils";
import {CreatureService} from "../../services/creature.service";
import {ErrorService} from "../../shared/error-service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ExpeditionService} from "../../services/expedition.service";
import {TimerService} from "../../services/timer.service";

@Component({
  selector: 'detail-actions-left',
  templateUrl: './actions-left.component.html',
  // encapsulation: ViewEncapsulation.None,
  styleUrls: ['./../creature.component.css', './actions-left.component.css']
})
export class ActionsLeftComponent implements OnInit {

  faHourglass = faHourglass;
  faBolt = faBolt;
  trainingActions = [
    {icon: faDumbbell, skill: "strength"},
    {icon: faShield, skill: "defence"},
    {icon: faBrain, skill: "intelligence"},
    {icon: faBoltLightning, skill: "speed"}
  ];

  elements: Array<any> = [];
  selectedExpeditionElement: any;
  selectedExpeditions: any;
  expeditionLengths: any;
  expeditionEnergyCost: number = 0;

  selectedExpeditionId: number = 0;
  selectedLength: number = 0;

  @Input('creatureId') creatureId: number = 0;

  @Output() errorMessage = new EventEmitter<string>();
  @Output() availableAt = new EventEmitter<string>();
  @Output() reloadStats = new EventEmitter<boolean>();

  constructor(private elementService: ElementService, private creatureService: CreatureService, private expeditionService: ExpeditionService, private modalService: NgbModal) { }

  ngOnInit(): void {
    //get elements
    this.elementService.getAllElements().then((elements: any) => {
      this.elements = elements;

      //assign icons to elements
      for (const element of this.elements) {
        element.icon = this.getElementIcon(element.name);
      }
    });
  }

  train(skill: string) {
    if (this.creatureId > 0) {
      this.creatureService.trainCreature(this.creatureId, skill).then(
        (res: any) => {
          //for reporting 200 responses
          if (res.success === false) {
            this.errorMessage.emit(res.message);
          } else if (res.success === true) {
            //successfully training
            this.availableAt.emit(res['available_at']);
            this.reloadStats.emit(true);
          }
        },
        (error) => {
          //for reporting 400 & 500 responses
          if (error.error.success === false) {
            let message = ErrorService.getErrorMessage(error);
            this.errorMessage.emit(message);
          }
        }
      );
    }
  }

  openExpeditionModal(modalContent: any, elementName: string) {
    this.selectedExpeditionElement = null;
    this.selectedExpeditionElement = this.elements.find(({ name }) => name === elementName);
    if (this.selectedExpeditionElement) {

      //get expedition data for element
      console.log(this.selectedExpeditionElement)

      this.expeditionService.getExpeditionsByElement(this.selectedExpeditionElement.id).then(
        (res: any) => {
          this.selectedExpeditions = res;
        }, (error) => {
          if (error.error.success === false) {
            let message = ErrorService.getErrorMessage(error);
            this.errorMessage.emit(message);
          }
        }
      );
      this.expeditionService.getExpeditionLengths().then(
        (res: any) => {
          this.expeditionLengths = res;
        }, (error) => {
          if (error.error.success === false) {
            let message = ErrorService.getErrorMessage(error);
            this.errorMessage.emit(message);
          }
        }
      )

      this.openModal(modalContent).then(
        (result) => {
          if (result === true) {
            //vyslat na expedici
            if (this.selectedExpeditionId > 0 && this.selectedLength > 0) {
              this.expeditionService.sendOnExpedition(this.creatureId, this.selectedExpeditionId, this.selectedLength).then(
                (res: any) => {
                  if (res.success) {
                    this.availableAt.emit(res['available_at']);
                    this.reloadStats.emit(true);
                  }
                }, (error) => {
                  if (error.error.success === false) {
                    let message = ErrorService.getErrorMessage(error);
                    this.errorMessage.emit(message);
                  }
                }
              );
            }
          }
        }, () => { }
      );

    }
  }

  private openModal(modalContent: any) {
    return this.modalService.open(modalContent, {centered: true, size: "lg"}).result;
  }

  private getElementIcon(name: string) {
    return Utils.getElementIcon(name);
  }

  log(e: any) {
    console.log(e);
  }

}
