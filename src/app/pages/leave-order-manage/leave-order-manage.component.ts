import { Component, OnInit } from '@angular/core';
import { testItems } from '../../test-data';
import { LeaveOrdersService } from '../../services/leave-orders.service';
import { EmployeeService } from '../../services/employees.service';
import { AnnualLeaveRelationService } from '../../services/annual-leave-relation.service';
import { user, userAdmin } from '../userInfo';
import { ToastService } from '../../components/toast/toast-service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { Observable } from '../../../../node_modules/rxjs';

@Component({
  selector: 'app-leave-order-manage',
  templateUrl: './leave-order-manage.component.html',
  styleUrls: ['./leave-order-manage.component.scss']
})
export class LeaveOrderManageComponent implements OnInit {

  loginUser: any;
  hint = '';
  isListMode = true;
  leaveOrders: Array<any> = [];
  selectedLeaveOrder: any;
  annualLeaveRelation: any;
  query = {};
  leaveOrderForm: FormGroup = this.fb.group({
    uuid: [''],
    no: [''],
    leaveType: new FormControl({ value: '', disabled: true }),
    cause: [''],
    status: new FormControl({ value: '', disabled: true }),
    dateStart: [''],
    dateEnd: [''],
    leaveTime: [''],
    employeeUuid: [''],
    remark: [''],
    agentName: [''],
  });
  employeeAnnualLeave: any;
  constructor(
    private fb: FormBuilder,
    private leaveOrdersService: LeaveOrdersService,
    private employeeService: EmployeeService,
    private toastService: ToastService,
    private annualLeaveRelationService: AnnualLeaveRelationService,
    private router: Router,
  ) { }

  ngOnInit() {
    if (!localStorage.getItem('angleHrUser')) {
      this.router.navigate(['pages/login']);
    } else {
      this.loginUser = JSON.parse(localStorage.getItem('angleHrUser'));
    }
    if (this.loginUser.adminFlag === 'Y') {
      this.loadLeaveOrders();
      this.loadAnnualLeaveRelation();
    } else {
      this.hint = '無權限瀏覽';
    }
  }


  loadLeaveOrders() {
    this.leaveOrdersService.getAllPageable(this.query).subscribe(result => {
      this.leaveOrders = result.content.sort((a, b) => a.dateStart > b.dateStart ? -1 : 1);
      this.leaveOrders = this.leaveOrders.filter(v => v.status === '1');
      this.leaveOrders.forEach(item => {
        const empUuid = item.employeeUuid;
        this.employeeService.getOne(empUuid).subscribe(v => {
          item.employeeName = v.name;
        });
      });
    });
  }

  loadAnnualLeaveRelation() {
    const userUuid = this.loginUser.uuid;
    this.annualLeaveRelationService.getOne(this.loginUser.uuid).subscribe(result => {
      this.annualLeaveRelation = result;
    });
  }
  loadEmployee(employeeUuid) {
    this.annualLeaveRelationService.getOne(employeeUuid).subscribe(result => {
      this.employeeAnnualLeave = result;
    });
  }

  clickPass() {
    if (this.selectedLeaveOrder.leaveType === '8') {
      if (this.employeeAnnualLeave.days < this.selectedLeaveOrder.leaveTime / 8) {
        this.toastService.open({
          type: 'danger',
          message: '無特休天數可用'
        });
        return;
      }
    }
    this.selectedLeaveOrder.status = '2';
    this.leaveOrdersService.update(this.selectedLeaveOrder.uuid, this.selectedLeaveOrder).subscribe(result => {
      this.leaveOrderForm.get('status').setValue('2');
      this.loadLeaveOrders();
      this.toastService.open({
        type: 'success',
        message: '審核成功'
      });
      this.isListMode = true;
    }, err => {
      this.selectedLeaveOrder.status = '1';
      this.toastService.open({
        type: 'danger',
        message: '審核失敗'
      });
    }
    );
    this.loadAnnualLeaveRelation();
  }
  clickNoPass() {
    this.selectedLeaveOrder.status = '3';
    this.leaveOrdersService.update(this.selectedLeaveOrder.uuid, this.selectedLeaveOrder).subscribe(v => {
      this.leaveOrderForm.get('status').setValue('3');
      this.loadLeaveOrders();
      this.toastService.open({
        type: 'success',
        message: '審核成功'
      });
      this.isListMode = true;
    }, err => {
      this.selectedLeaveOrder.status = '1';
      this.toastService.open({
        type: 'danger',
        message: '審核失敗'
      });
    });
  }

  onLeaveOrderItemChecked(ord, $event) {
    ord.checked = $event.target.checked;
  }

  toggleAll($event) {
    this.leaveOrders.forEach(v => v.checked = $event.target.checked);
  }

  backToList() {
    this.isListMode = true;
  }

  showDetail(ord) {
    this.selectedLeaveOrder = ord;
    this.loadEmployee(this.selectedLeaveOrder.employeeUuid);
    this.leaveOrderForm.reset();
    const dateStart = moment(ord.dateStart).format('YYYY-MM-DD') === 'Invalid date' ? '' :
      moment(ord.dateStart).format('YYYY-MM-DD');
    const dateEnd = moment(ord.dateEnd).format('YYYY-MM-DD') === 'Invalid date' ? '' :
      moment(ord.dateEnd).format('YYYY-MM-DD');
    const agentName = ord.employee == null ? '' : ord.employee.name;
    this.leaveOrderForm.get('uuid').setValue(ord.uuid);
    this.leaveOrderForm.get('no').setValue(ord.no);
    this.leaveOrderForm.get('leaveType').setValue(ord.leaveType);
    this.leaveOrderForm.get('cause').setValue(ord.cause);
    this.leaveOrderForm.get('status').setValue(ord.status);
    this.leaveOrderForm.get('dateStart').setValue(dateStart);
    this.leaveOrderForm.get('dateEnd').setValue(dateEnd);
    this.leaveOrderForm.get('leaveTime').setValue(ord.leaveTime);
    this.leaveOrderForm.get('employeeUuid').setValue(ord.employeeUuid);
    this.leaveOrderForm.get('remark').setValue(ord.remark);
    this.leaveOrderForm.get('agentName').setValue(agentName);
    this.isListMode = false;
  }
}
