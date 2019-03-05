import { Component, Input } from '@angular/core';

import { NgbModal, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-hr-alert',
    template: `
    <div *ngIf="data.title" class="modal-header">
        <div *ngIf="data.iconClass" class="ione-alert-icon">
            <i [class]="data.iconClass"></i>
        </div>
        <h6 class="modal-title">{{data.title}}</h6>
        <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss()">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>

    <div class="modal-body">
        <div class="ione-alert-message" >{{data.message}}</div>
    </div>

    <div class="modal-footer">
        <button class="btn btn-outline-danger" *ngFor="let button of data.buttons"
        (click)="btnClick(button)" [ngClass]="button.cssClass ? button.cssClass : ''">
            {{button.text}}
        </button>
    </div>
  `
})
export class AlertComponent {
    @Input() data;
    constructor(public activeModal: NgbActiveModal) { }

    btnClick(button: any) {
        if (button.handler) {
            button.handler();
        }
        this.activeModal.close();
    }
}
