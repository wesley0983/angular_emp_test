import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../../components/toast/toast-service';
import { EmployeeService } from '../../../services/employees.service';

@Component({
    selector: 'app-employee-picker-popup',
    templateUrl: './employee-picker-popup.component.html',
    styleUrls: ['./employee-picker-popup.component.scss']
})
export class EmployeePickerPopupComponent implements OnInit {

    @Input('marketUuid') marketUuid: string;
    @Input('enableAuth') enableAuth = true;
    selectedEmployee: any = {};
    employees: Array<any> = [];
    query: any = {
        no: '',
        name: ''
    };
    pager: any = {
        page: 0,
    };

    constructor(
        public activeModal: NgbActiveModal,
        private employeeService: EmployeeService,
        private toastService: ToastService,
    ) { }

    ngOnInit() {
        this.refresh();
    }

    search() {
        this.pager = {
            ...this.pager,
            page: 0
        };
        this.refresh();
    }

    refresh() {
        const params = {
            ...this.query,
            ...this.pager,
            marketUuid: this.marketUuid,
            enableAuth: this.enableAuth,
        };

        this.employeeService.getAllPageable(params, this.pager).subscribe(results => {
            this.employees = results.content;
            this.employees = this.employees.filter(v => v.leaveDate === null);
            this.employees.forEach(v => v.checked = v.uuid === this.selectedEmployee.uuid);
            this.pager = {
                first: results.first,
                last: results.last,
                page: results.number,
                size: results.size,
                totalElements: results.totalElements,
                totalPages: results.totalPages,
            };
        }, err => {

        }, () => {

        });
    }

    pagerChange() {
        this.refresh();
    }

    toggleItem(employee) {
        this.employees.forEach(v => v.checked = v.uuid === employee.uuid);
        this.selectedEmployee = employee;
    }

    submitItem(employee) {
        this.activeModal.close(employee);
    }

    submit() {
        if (this.selectedEmployee.uuid) {
            this.activeModal.close(this.selectedEmployee);
        } else {
            this.toastService.open({
                type: 'warning',
                message: '請選擇員工'
            });
        }
    }
}
