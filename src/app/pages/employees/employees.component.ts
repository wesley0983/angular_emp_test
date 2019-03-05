import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import { UUID } from 'angular2-uuid';
import { EmployeeService } from '../../services/employees.service';
import { AnnualLeaveRelationService } from '../../services/annual-leave-relation.service';
import { catchError } from 'rxjs/operators/catchError';
import { _throw } from 'rxjs/observable/throw';
import { ToastService } from '../../components/toast/toast-service';
import { AlertService } from '../../components/alert/alert-service';
import { QueryLogical } from '../../directives/query-filter-object/query-logical.enum';
import { QueryOperator } from '../../directives/query-filter-object/query-operator.enum';
import { user, userAdmin } from '../userInfo';
import * as moment from 'moment';
import { LoginComponent } from '../../login/login.component';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
  providers: [],
})
export class EmployeesComponent implements OnInit {
  hint = '';
  loginUser: any;
  loginUserAdmin: any;
  employees: Array<any> = [];
  selectedEmployee: any;
  isListMode = true;
  isEditMode = false;
  queryOperators = QueryOperator;
  queryLogicals = QueryLogical;
  pager: any = {
    page: 0,
    size: 100
  };
  query: any = {
    keywords: '',
    no: '',
    name: ''
  };
  selectedEmployeesItemForm: FormGroup = this.fb.group({
    uuid: [''],
    no: [''],
    name: [''],
    sex: ['1'],
    phone: [''],
    email: [''],
    password: [''],
    adminFlag: ['N'],
    arriveDate: [''],
    leaveDate: [''],
    careerName: [''],
    identification: [''],
  });
  EmpAnnualLeaveRelationForm: FormGroup = this.fb.group({
    uuid: [''],
    seniority: [''],
    days: [''],
    employeeUuid: [''],
  });
  addButtomEnable = false;
  deleteButtomEnable = false;

  constructor(
    private fb: FormBuilder,
    private httpClient: HttpClient,
    private employeeService: EmployeeService,
    private toastService: ToastService,
    private alertService: AlertService,
    private annualLeaveRelationService: AnnualLeaveRelationService,
    private router: Router,
  ) {

  }

  ngOnInit() {
    if (!localStorage.getItem('angleHrUser')) {
      this.router.navigate(['pages/login']);
    } else {
      this.loginUser = JSON.parse(localStorage.getItem('angleHrUser'));
      this.refresh();
    }
  }

  refresh() {
    if (this.loginUser.adminFlag === 'Y') {
      this.loadEmployees();
    } else {
      this.hint = '無權限瀏覽';
      this.addButtomEnable = true;
      this.deleteButtomEnable = true;
    }
  }

  search() {
    // this.pager = {
    //   ...this.pager,
    //   page: 0,
    // };
    // this.refresh();
    if (this.query.keywords === '') {
      this.refresh();
    } else {
      this.employees = this.employees.filter(v => v.name === this.query.keywords || v.no === this.query.keywords);
    }
  }

  loadEmployees() {
    this.employeeService.getAllPageable(this.query, this.pager).subscribe(result => {
      this.employees = result.content;
      this.employees = this.employees.map(v => {
        return {
          ...v,
          checked: false,
        };
      });
    });
  }

  clickSearch() {
    if (this.query === '') {
      this.loadEmployees();
    } else {
      this.employees = this.employees.filter(v => v.no === this.query || v.name === this.query);
    }
  }

  clickEdit(item) {
    this.isListMode = false;
    this.selectedEmployee = item;
    this.selectedEmployeesItemForm.reset();
    const arriveDate = moment(item.arriveDate).format('YYYY-MM-DD') === 'Invalid date' ? '' :
      moment(item.arriveDate).format('YYYY-MM-DD');
    const leaveDate = moment(item.leaveDate).format('YYYY-MM-DD') === 'Invalid date' ? '' :
      moment(item.leaveDate).format('YYYY-MM-DD');
    this.selectedEmployeesItemForm.get('uuid').setValue(item.uuid);
    this.selectedEmployeesItemForm.get('no').setValue(item.no);
    this.selectedEmployeesItemForm.get('name').setValue(item.name);
    this.selectedEmployeesItemForm.get('sex').setValue(item.sex);
    this.selectedEmployeesItemForm.get('phone').setValue(item.phone);
    this.selectedEmployeesItemForm.get('email').setValue(item.email);
    this.selectedEmployeesItemForm.get('password').setValue(item.password);
    this.selectedEmployeesItemForm.get('adminFlag').setValue(item.adminFlag);
    this.selectedEmployeesItemForm.get('arriveDate').setValue(arriveDate);
    this.selectedEmployeesItemForm.get('leaveDate').setValue(leaveDate);
    this.selectedEmployeesItemForm.get('careerName').setValue(item.careerName);
    this.selectedEmployeesItemForm.get('identification').setValue(item.identification);
    this.annualLeaveRelationService.getOne(item.uuid).subscribe(result => {
      this.EmpAnnualLeaveRelationForm.get('uuid').setValue(result.uuid);
      this.EmpAnnualLeaveRelationForm.get('seniority').setValue(result.seniority);
      this.EmpAnnualLeaveRelationForm.get('days').setValue(result.days);
    });
  }

  clickBatchDelete() {
    const selectedItems = this.employees.filter(v => v.checked);
    const selectedItemsUuids = selectedItems.map(v => v.uuid);
    if (selectedItemsUuids.length > 0) {
      this.alertService.open({
        message: '確認批量刪除',
        buttons: [
          { text: '取消', handler: () => { } },
          {
            text: '確認', handler: () => {
              this.employeeService.batchDelete(selectedItemsUuids).subscribe(result => {
                selectedItemsUuids.forEach(uuid => {
                  this.employees = this.employees.filter(v => v.uuid !== uuid);
                });
              });
              this.toastService.open({
                type: 'success',
                message: '刪除成功'
              });
            }
          },
        ]
      });
    } else {
      this.toastService.open({
        type: 'warning',
        message: '請選擇員工'
      });
    }
  }

  clickAdd() {
    this.selectedEmployee = {
      uuid: '',
      no: '',
      name: '',
      sex: '1',
      phone: '',
      email: '',
      password: '',
      adminFlag: 'N',
      arriveDate: '',
      leaveDate: '',
      careerName: '',
      identification: '',
    };
    const annualLeaveRelation = {
      uuid: '',
      seniority: '',
      days: '',
      employeeUuid: '',
    };
    this.selectedEmployeesItemForm.reset();
    this.selectedEmployeesItemForm.patchValue(this.selectedEmployee);
    this.EmpAnnualLeaveRelationForm.reset();
    this.EmpAnnualLeaveRelationForm.patchValue(annualLeaveRelation);
    this.isListMode = false;
  }

  clickSave() {
    const employeeItemInput = this.selectedEmployeesItemForm.value;
    if (employeeItemInput.uuid) {
      this.employeeService.update(employeeItemInput.uuid, employeeItemInput).subscribe(result => {
        this.refresh();
        this.isListMode = true;
        this.toastService.open({
          type: 'success',
          message: '更新成功'
        });
      }, err => {
        this.toastService.open({
          type: 'danger',
          message: err
        });
      });
    } else {
      this.employeeService.add(employeeItemInput).subscribe(result => {
        this.refresh();
        this.isListMode = true;
        this.toastService.open({
          type: 'success',
          message: '新增成功'
        });
      }, err => {
        this.toastService.open({
          type: 'danger',
          message: err
        });
      });
    }
  }

  toggleAll($event) {
    this.employees.forEach(v => v.checked = $event.target.checked);
  }

  backToList() {
    this.isListMode = true;
    this.isEditMode = false;
  }

  validate(employeeItem: any): Observable<any> {
    const arriveDate = moment(employeeItem.arriveDate).format('YYYY-MM-DD') === 'Invalid date' ? '' :
      moment(employeeItem.arriveDate).format('YYYY-MM-DD');
    return Observable.create(observer => {
      if (!employeeItem.no) {
        observer.error('編號不可為空');
        return;
      }
      if (!employeeItem.email) {
        observer.error('信箱不可為空');
        return;
      }
      if (!employeeItem.careerName) {
        observer.error('職稱不可為空');
        return;
      }
      if (!arriveDate) {
        observer.error('到職日不可為空');
        return;
      }
      if (!employeeItem.password) {
        observer.error('密碼不可為空');
        return;
      }
      observer.next('succeed');
    });
  }
}
