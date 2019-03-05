import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { user, userAdmin } from '../userInfo';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import { LeaveOrdersService } from '../../services/leave-orders.service';
import { ToastService } from '../../components/toast/toast-service';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployeePickerPopupComponent } from '../picker-popup/employee-picker-popup/employee-picker-popup.component';
import { AnnualLeaveRelationService } from '../../services/annual-leave-relation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leave-apply',
  templateUrl: './leave-apply.component.html',
  styleUrls: ['./leave-apply.component.scss']
})
export class LeaveApplyComponent implements OnInit {

  loginUser: any;
  sex: any;
  annualLeave: any;
  leaveHour: any;
  leaveOrderForm: FormGroup = this.fb.group({
    uuid: [''],
    no: [''],
    leaveType: ['1'],
    cause: ['', Validators.required],
    status: ['1'],
    dateStart: [''],
    dateEnd: [''],
    leaveTime: new FormControl({ value: '', disabled: true }),
    employeeUuid: [''],
    remark: ['', Validators.required],
    agent: [''],
    agentName: [''],
    startAmPm: ['1'],
    endAmPm: ['1'],
  });
  constructor(
    private fb: FormBuilder,
    private leaveOrdersService: LeaveOrdersService,
    private toastService: ToastService,
    private modalService: NgbModal,
    private annualLeaveRelationService: AnnualLeaveRelationService,
    private router: Router,
  ) { }

  ngOnInit() {
    if (!localStorage.getItem('angleHrUser')) {
      this.router.navigate(['pages/login']);
    } else {
      this.loginUser = JSON.parse(localStorage.getItem('angleHrUser'));
      this.sex = this.loginUser.identification;
      if (this.loginUser.identification) {
        const id: string = this.loginUser.identification;
        this.sex = id.slice(1, 2);
      }
      this.loadAnnualLeaveRelation();
    }
  }

  loadAnnualLeaveRelation() {
    this.annualLeaveRelationService.getOne(this.loginUser.uuid).subscribe(result => {
      this.annualLeave = result;
    });
  }

  clickSave() {
    this.leaveOrderForm.get('no').setValue(moment.now());
    this.leaveOrderForm.get('employeeUuid').setValue(this.loginUser.uuid);
    let leaveOrderInput = this.leaveOrderForm.value;
    this.validate(leaveOrderInput).pipe(
      switchMap(result => {
        leaveOrderInput.leaveTime = this.leaveHour;
        return this.leaveOrdersService.leaveOrderApply(leaveOrderInput);
      }),
    ).subscribe(leaveOrderItem => {
      this.toastService.open({
        type: 'success',
        message: '申請成功'
      });
      this.router.navigate(['pages/leaveRecord']);
    }, err => {
      this.toastService.open({
        type: 'danger',
        message: err
      });
    });
  }

  updateAnnualLeaveDays(annualLeave: any): any {
    let day = annualLeave.days;
    day--;
    return {
      ...annualLeave,
      days: day,
    };
  }

  clickSearchEmployee() {
    const modal = this.modalService.open(EmployeePickerPopupComponent);
    modal.result.then(employee => {
      this.leaveOrderForm.get('agent').setValue(employee.uuid);
      this.leaveOrderForm.get('agentName').setValue(employee.name);
    }, (reason) => {

    });
  }

  cleanEmployee() {
    this.leaveOrderForm.get('agent').setValue('');
    this.leaveOrderForm.get('agentName').setValue('');
  }

  validate(leaveOrderItem: any): Observable<any> {
    const dateStart = moment(leaveOrderItem.dateStart).format('YYYY-MM-DD') === 'Invalid date' ? '' :
      moment(leaveOrderItem.dateStart).format('YYYY-MM-DD');
    const dateEnd = moment(leaveOrderItem.dateStart).format('YYYY-MM-DD') === 'Invalid date' ? '' :
      moment(leaveOrderItem.dateEnd).format('YYYY-MM-DD');
    const validateTimeSlot = this.validateTimeSlot(leaveOrderItem);
    return Observable.create(observer => {
      if (leaveOrderItem.leaveType === '8') {
        if (this.annualLeave.days < this.leaveHour / 8) {
          observer.error('特休天數不足');
          return;
        }
      }
      if (!leaveOrderItem.cause) {
        observer.error('事由不可為空');
        return;
      }
      if (!leaveOrderItem.dateStart) {
        observer.error('請假起始日不可為空');
        return;
      }
      if (!leaveOrderItem.dateEnd) {
        observer.error('請假結束日不可為空');
        return;
      }
      if (dateStart > dateEnd) {
        observer.error('請假起始日不可大於結束日');
        return;
      }
      observer.next('succeed');
    });
  }

  validateTimeSlot(leaveOrderItem: any) {
    const dateStart = new Date(leaveOrderItem.dateStart);
    const dateEnd = new Date(leaveOrderItem.dateEnd);
    const diffDays = this.cacularLeaveTime();
    this.leaveHour = diffDays;
    return diffDays;
  }

  cacularLeaveTime() {
    const leaveOrderItem = this.leaveOrderForm.value;
    const dateStart = new Date(leaveOrderItem.dateStart);
    const dateEnd = new Date(leaveOrderItem.dateEnd);
    const a = moment(dateStart, 'DD/MM/YYYY');
    const b = moment(dateEnd, 'DD/MM/YYYY');
    let diffDays = b.diff(a, 'days') + 1;
    if (leaveOrderItem.startAmPm === '1' && leaveOrderItem.endAmPm === '2') {
      diffDays = diffDays;
    } else if (leaveOrderItem.startAmPm === '2' && leaveOrderItem.endAmPm === '1') {
      diffDays = diffDays - 1;
    } else {
      diffDays = diffDays - 0.5;
    }
    this.leaveOrderForm.get('leaveTime').setValue(diffDays * 8);
    return diffDays * 8;
  }
}
