import { Component, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs';
import { interval } from 'rxjs/observable/interval';
import { takeUntil } from 'rxjs/operators/takeUntil';


@Component({
    selector: 'Hr-toast',
    template: `
    <div [class]=" 'alert alert-' + (data.type ? data.type : 'success') "
         role="alert" (click)="close()" @fadeIn>

        <div class="ione-toast-icon-message">
            {{data.message}}
        </div>
    </div>
  `,
    animations: [
        trigger('fadeIn', [
            state('in', style({ display: 'none' })),
            transition('void => *', [
                animate(300, keyframes([
                    style({ marginBottom: '-70px', opacity: 0, offset: 0 }),
                    style({ marginBottom: '0px', opacity: 1, offset: 1 })
                ]))
            ]),
        ])]
})
export class ToastComponent implements OnDestroy, AfterViewInit {
    @Input() data;
    private turnOffTimer: Subscription;
    ngUnsubscribe: Subject<any> = new Subject<any>();

    constructor(public activeModal: NgbActiveModal) {

    }

    ngAfterViewInit() {
        this.startTurnOffTimer();
    }

    close() {
        this.activeModal.close();
    }

    startTurnOffTimer() {
        this.turnOffTimer = interval(this.data.duration * 600).pipe(
            takeUntil(this.ngUnsubscribe)
        ).subscribe(() => this.activeModal.dismiss());
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
