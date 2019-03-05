import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { employees } from '../../test-data';
import { user, userAdmin } from '../userInfo';
import { AnnualLeaveRelationService } from '../../services/annual-leave-relation.service';
import { EmployeeService } from '../../services/employees.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ToastService } from '../../components/toast/toast-service';
import { LoginComponent } from '../../login/login.component';
import { BasePageService } from '../base-page.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent implements OnInit {



  annualLeave: any = {
    seniority: '',
    days: '',
  };
  loginUser: any;
  employee: any;
  employeesItemForm: FormGroup = this.fb.group({
    uuid: [''],
    no: new FormControl({ value: '', disabled: true }),
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
  isEditMode = false;
  constructor(
    public annualLeaveRelationService: AnnualLeaveRelationService,
    public fb: FormBuilder,
    public employeeService: EmployeeService,
    public toastService: ToastService,
    public router: Router,
    private activatedRoute: ActivatedRoute,
  ) {

  }

  ngOnInit() {
    if (!localStorage.getItem('angleHrUser')) {
      this.router.navigate(['pages/login']);
    } else {
      this.loginUser = JSON.parse(localStorage.getItem('angleHrUser'));
      this.employeesItemForm.get('uuid').setValue(this.loginUser.uuid);
      this.employeesItemForm.get('no').setValue(this.loginUser.no);
      this.employeesItemForm.get('name').setValue(this.loginUser.name);
      this.employeesItemForm.get('sex').setValue(this.loginUser.sex);
      this.employeesItemForm.get('phone').setValue(this.loginUser.phone);
      this.employeesItemForm.get('email').setValue(this.loginUser.email);
      this.employeesItemForm.get('password').setValue(this.loginUser.password);
      this.employeesItemForm.get('adminFlag').setValue(this.loginUser.adminFlag);
      this.employeesItemForm.get('arriveDate').setValue(this.loginUser.arriveDate);
      this.employeesItemForm.get('leaveDate').setValue(this.loginUser.leaveDate);
      this.employeesItemForm.get('careerName').setValue(this.loginUser.careerName);
      this.employeesItemForm.get('identification').setValue(this.loginUser.identification);
      this.loadAnnualLeaveRelation();
    }
  }

  loadAnnualLeaveRelation() {
    const userUuid = this.loginUser.uuid;
    this.annualLeaveRelationService.getOne(userUuid).subscribe(result => {
      this.annualLeave = result;
    });
  }

  clickSave() {
    const employeeItemInput = this.employeesItemForm.value;
    this.employeeService.update(employeeItemInput.uuid, employeeItemInput).subscribe(result => {
      localStorage.removeItem('angleHrUser');
      this.loginUser.identification = employeeItemInput.identification;
      this.loginUser.sex = (employeeItemInput.identification).slice(1, 2) === '1' ? '1' : '2';
      localStorage.setItem('angleHrUser', JSON.stringify(this.loginUser));
      this.ngOnInit();
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

}
