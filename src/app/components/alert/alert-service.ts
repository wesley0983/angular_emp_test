import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertComponent } from './alert-component';
import { AlertOptions } from './alert-options';
@Injectable()
export class AlertService {
    constructor(
        private ngbModal: NgbModal,
    ) { }

    open(opts: AlertOptions = {}) {
        opts.buttons = opts.buttons ? opts.buttons : [{ text: '确认' }];
        opts.backdrop = opts.backdrop ? opts.backdrop : 'static';

        const modalRef = this.ngbModal.open(AlertComponent, opts);
        modalRef.componentInstance.data = opts;
    }
}
