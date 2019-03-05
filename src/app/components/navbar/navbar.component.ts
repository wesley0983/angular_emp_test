import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employees.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  navbarMessage = '';
  user: any;
  constructor(
    private router: Router,
    private employeeService: EmployeeService,
  ) { }

  ngOnInit() {
    if (localStorage.getItem('angleHrUser')) {
      this.user = JSON.parse(localStorage.getItem('angleHrUser'));
      this.navbarMessage = `你好，${this.user.name} (登出)`;
    }
  }

  logOut() {
    localStorage.removeItem('angleHrUser');
    this.router.navigate(['pages/login']);
  }
}
