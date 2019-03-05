import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastComponent } from './toast-component';
import { ToastOptions } from './toast-options';
@Injectable()
export class ToastService {
    constructor(
        private ngbModal: NgbModal,
    ) { }

    open(opts: ToastOptions = {}): NgbModalRef {
        opts.duration = opts.duration ? opts.duration : 4;
        opts.backdrop = opts.backdrop ? opts.backdrop : false;
        opts.windowClass = opts.windowClass ? opts.windowClass + ' ione-toast-window' : 'ione-toast-window';
        // opts.container = 'body';
        const toastRef = this.ngbModal.open(ToastComponent, opts);
        toastRef.componentInstance.data = opts;
        return toastRef;

    }

    success(message: string): NgbModalRef {
        const toastRef = this.open({
            duration: 1,
            iconClass: 'fa fa-check',
            type: 'success',
            message: message
        });
        return toastRef;
    }

    danger(message: string): NgbModalRef {
        const toastRef = this.open({
            iconClass: 'fa fa-exclamation-triangle',
            type: 'danger',
            message: message
        });
        return toastRef;
    }
}
