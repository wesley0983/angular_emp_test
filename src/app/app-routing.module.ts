import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainPageComponent } from './main-page/main-page.component';
import { BlankComponent } from './pages/blank/blank.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { LeaveApplyComponent } from './pages/leave-apply/leave-apply.component';
import { LeaveOrderManageComponent } from './pages/leave-order-manage/leave-order-manage.component';
import { LeaveRecordComponent } from './pages/leave-record/leave-record.component';
import { UserInfoComponent } from './pages/user-info/user-info.component';

const routes: Routes = [
  { path: '', redirectTo: 'pages/login', pathMatch: 'full' },
  { path: 'pages/login', component: LoginComponent },
  {
    path: 'pages',
    component: MainPageComponent,
    children: [
      { path: '', redirectTo: 'userInfo', pathMatch: 'full' }, 
      { path: '#', component: BlankComponent },
      { path: 'employees', component: EmployeesComponent },
      { path: 'userInfo', component: UserInfoComponent },
      { path: 'leaveApply', component: LeaveApplyComponent },
      { path: 'leaveOrderManage', component: LeaveOrderManageComponent },
      { path: 'leaveRecord', component: LeaveRecordComponent },
      // { path: 'AnnualLeaveRelation', component: AnnualLeaveRelationComponent },
      // { path: 'login', component: LoginComponent },
    ]
  },
  // { path: '**', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
