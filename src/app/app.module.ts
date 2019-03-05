import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import { BlankComponent } from './pages/blank/blank.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { EmployeeService } from './services/employees.service';
import { EmployeePickerPopupComponent } from './pages/picker-popup/employee-picker-popup/employee-picker-popup.component';
import { UserInfoComponent } from './pages/user-info/user-info.component';
import { LeaveRecordComponent } from './pages/leave-record/leave-record.component';
import { Page4Component } from './pages/page4/page4.component';
import { LeaveApplyComponent } from './pages/leave-apply/leave-apply.component';
import { LeaveOrderManageComponent } from './pages/leave-order-manage/leave-order-manage.component';
import { AnnualLeaveRelationComponent } from './pages/annual-leave-relation/annual-leave-relation.component';
import { Page6Component } from './pages/page6/page6.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { MainComponent } from './components/main/main.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastComponent } from './components/toast/toast-component';
import { ToastService } from './components/toast/toast-service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertComponent } from './components/alert/alert-component';
import { AlertService } from './components/alert/alert-service';
import { LeaveOrdersService } from './services/leave-orders.service';
import { AnnualLeaveRelationService } from './services/annual-leave-relation.service';
import { QureyObjectAccessorDirective } from './directives/query-filter-object/qurey-object-accessor.directive';
import { SortObjectAccessorDirective } from './directives/query-sort-object/sort-object-accessor.directive';
import { ExcelService } from './services/excel-export.service';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    BlankComponent,
    EmployeesComponent,
    EmployeePickerPopupComponent,
    UserInfoComponent,
    LeaveRecordComponent,
    Page4Component,
    LeaveApplyComponent,
    Page6Component,
    LoginComponent,
    NavbarComponent,
    SideMenuComponent,
    MainComponent,
    ToastComponent,
    AlertComponent,
    LeaveOrderManageComponent,
    AnnualLeaveRelationComponent,
    QureyObjectAccessorDirective,
    SortObjectAccessorDirective,
  ],
  entryComponents: [
    ToastComponent,
    AlertComponent,
    EmployeePickerPopupComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
  ],
  providers: [
    EmployeeService,
    ToastService,
    AlertService,
    LeaveOrdersService,
    AnnualLeaveRelationService,
    ExcelService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
