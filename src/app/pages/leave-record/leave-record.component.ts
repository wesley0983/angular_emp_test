import { Component, OnInit } from '@angular/core';
import { LeaveOrdersService } from '../../services/leave-orders.service';
import { EmployeeService } from '../../services/employees.service';
import { AnnualLeaveRelationService } from '../../services/annual-leave-relation.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { ToastService } from '../../components/toast/toast-service';
import { ExcelService } from '../../services/excel-export.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leave-record',
  templateUrl: './leave-record.component.html',
  styleUrls: ['./leave-record.component.scss']
})


export class LeaveRecordComponent implements OnInit {

  loginUser: any;
  hint: any = '';
  leaveOrders: Array<any> = [];
  selectedLeaveOrder: any;
  annualLeaveRelation: any = {};
  lookForAll = false;
  isListMode = true;
  isSaveButtondisable = true;
  pager: any = {
    page: 0,
    size: 100
  };
  search: string;
  query: any = {
    name: '',
    startDate: '',
    endDate: '',
  };
  leaveOrderForm: FormGroup = this.fb.group({
    uuid: new FormControl({ value: '', disabled: true }),
    no: new FormControl({ value: '', disabled: true }),
    leaveType: new FormControl({ value: '', disabled: true }),
    cause: new FormControl({ value: '', disabled: true }),
    status: new FormControl({ value: '1', disabled: true }),
    dateStart: new FormControl({ value: '', disabled: true }),
    dateEnd: new FormControl({ value: '', disabled: true }),
    leaveTime: new FormControl({ value: '', disabled: true }),
    employeeUuid: new FormControl({ value: '', disabled: true }),
    remark: new FormControl({ value: '', disabled: true }),
    agent: new FormControl({ value: '', disabled: true }),
    agentName: new FormControl({ value: '', disabled: true }),
  });
  constructor(
    private fb: FormBuilder,
    private leaveOrdersService: LeaveOrdersService,
    private employeeService: EmployeeService,
    private toastService: ToastService,
    private excelService: ExcelService,
    private annualLeaveRelationService: AnnualLeaveRelationService,
    private router: Router,
  ) { }

  ngOnInit() {
    if (!localStorage.getItem('angleHrUser')) {
      this.router.navigate(['pages/login']);
    } else {
      this.loginUser = JSON.parse(localStorage.getItem('angleHrUser'));
      this.loadLeaveOrders();
      this.loadAnnualLeaveRelation();
    }
  }
  Search() {
    this.loadLeaveOrders();
  }

  loadLeaveOrders() {
    this.leaveOrdersService.getAllPageable(this.query).subscribe(result => {
      this.leaveOrders = result.content.sort((a, b) => a.no > b.no ? -1 : 1);
      if (!this.lookForAll) {
        this.leaveOrders = this.leaveOrders.filter(v => v.employeeUuid === this.loginUser.uuid);
      }
      if (this.query.startDate !== '') {
        this.leaveOrders = this.leaveOrders.filter(v => moment(Number(v.no)).format('YYYY-MM-DD') >= this.query.startDate);
      }
      if (this.query.endDate !== '') {
        this.leaveOrders = this.leaveOrders.filter(v => moment(Number(v.no)).format('YYYY-MM-DD') <= this.query.endDate);
      }
      this.leaveOrders.forEach(item => {
        item.no = moment(Number(item.no)).format('YYYY-MM-DD');
        const empUuid = item.employeeUuid;
        this.employeeService.getOne(empUuid).subscribe(v => {
          item.employeeName = v.name;
        });
      });
    });
  }

  lookForAllChange($event) {
    this.lookForAll = $event.target.checked;
    this.loadLeaveOrders();
  }

  showDetail(ord) {
    this.selectedLeaveOrder = ord;
    this.leaveOrderForm.reset();
    const dateStart = moment(ord.dateStart).format('YYYY-MM-DD') === 'Invalid date' ? '' :
      moment(ord.dateStart).format('YYYY-MM-DD');
    const dateEnd = moment(ord.dateEnd).format('YYYY-MM-DD') === 'Invalid date' ? '' :
      moment(ord.dateEnd).format('YYYY-MM-DD');
    const agentUuid = ord.employee == null ? '' : ord.employee.uuid;
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
    this.leaveOrderForm.get('agent').setValue(agentUuid);
    this.isSaveButtondisable = ord.status !== '1';
    this.isListMode = false;
  }

  clickSave() {
    const leaveOrderInput = this.leaveOrderForm.value;
    this.leaveOrdersService.update(leaveOrderInput.uuid, leaveOrderInput).subscribe(result => {
      this.loadLeaveOrders();
      this.toastService.open({
        type: 'success',
        message: '保存成功'
      });
    }, err => {
      this.toastService.open({
        type: 'danger',
        message: '保存失敗'
      });
    });
  }

  loadAnnualLeaveRelation() {
    const userUuid = this.loginUser.uuid;
    this.annualLeaveRelationService.getOne(userUuid).subscribe(result => {
      this.annualLeaveRelation = result;
    });
  }

  backToList() {
    this.isListMode = true;
  }

  ExportExcel() {
    if (this.leaveOrders.length > 0) {
      this.hint = '報表導出中...';
      let excel: Array<any> = [];
      this.leaveOrders.forEach(v => excel.push(this.map(v)));
      this.excelService.exportAsExcelFile(excel, '請假紀錄');
      this.hint = '';
      this.toastService.open({
        type: 'success',
        message: '導出完成'
      });
    }
  }

  map(object: any): any {
    const obj = {
      申請人: object.employeeName,
      請假類型: this.getLeaveTypeName(object.leaveType),
      時數: object.leaveTime,
      起始日: moment(object.dateStart).format('YYYY-MM-DD') === 'Invalid date' ? '' :
        moment(object.dateStart).format('YYYY-MM-DD'),
      結束日: moment(object.dateEnd).format('YYYY-MM-DD') === 'Invalid date' ? '' :
        moment(object.dateEnd).format('YYYY-MM-DD'),
      事由: object.cause,
      備註: object.remark,
      年資: this.annualLeaveRelation.seniority,
      假單狀態: object.status === '1' ? '待審核' : object.status === '2' ? '通過' : '不通過',
      申請日期: object.no,
    };
    return obj;
  }

  getLeaveTypeName(number: string): any {
    let result;
    switch (number) {
      case '1':
        result = '事假';
        break;
      case '2':
        result = '病假';
        break;
      case '3':
        result = '公假';
        break;
      case '4':
        result = '公傷假';
        break;
      case '5':
        result = '婚假';
        break;
      case '6':
        result = '喪假';
        break;
      case '7':
        result = '產假';
        break;
      case '8':
        result = '特休';
        break;
      case '9':
        result = '補假';
        break;
      case '10':
        result = '陪產假';
        break;
      case '11':
        result = '生理假';
        break;
      default:
        result = '';
        break;
    }
    return result;
  }
}
