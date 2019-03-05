import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { EmployeeService } from '../services/employees.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../components/toast/toast-service';
import { BasePageService } from '../pages/base-page.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // export class LoginComponent extends BasePageService implements OnInit {

  loginUser: any = {
    email: '',
    password: '',
  };
  hint: any;
  constructor(
    private employeeService: EmployeeService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {

  }

  ngOnInit() {
    if (localStorage.getItem('angleHrUser')) {
      this.router.navigate(['pages/userInfo']);
    }
  }

  submit() {
    this.hint = '登入中...';
    const userInput = this.loginUser;
    this.employeeService.getOneByUserLogin(userInput).subscribe(result => {
      console.log(result);
      this.loginUser = result;
      this.hint = '登入成功';
      localStorage.setItem('angleHrUser', JSON.stringify(this.loginUser));
      sessionStorage.setItem('angleHrUserAdmin', result.adminFlag);
      this.router.navigate(['pages/userInfo']);
    }, err => {
      this.hint = err;
    });
  }

}
