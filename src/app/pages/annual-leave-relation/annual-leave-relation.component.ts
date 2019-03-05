import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { user, userAdmin } from '../userInfo';
import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';
import { LeaveOrdersService } from '../../services/leave-orders.service';
import { ToastService } from '../../components/toast/toast-service';
import { AnnualLeaveRelationService } from '../../services/annual-leave-relation.service';


@Component({
  selector: 'app-annual-leave-relation',
  templateUrl: './annual-leave-relation.component.html',
  styleUrls: ['./annual-leave-relation.component.scss']
})
export class AnnualLeaveRelationComponent implements OnInit {

  userInfo = userAdmin;
  annualOrderRelationForm: FormGroup = this.fb.group({
    uuid: [''],
    days: [''],
    seniority: [''],
  });

  constructor(
    private fb: FormBuilder,
    private leaveOrdersService: LeaveOrdersService,
    private toastService: ToastService,
    private annualLeaveRelationService: AnnualLeaveRelationService,
  ) { }

  ngOnInit() {
    this.loadAnnualLeaveRelation();
  }

  loadAnnualLeaveRelation() {
    this.annualLeaveRelationService.getAllPageable().subscribe(result => {
      const annualOrder = result.content[0];
      this.annualOrderRelationForm.reset();
      this.annualOrderRelationForm.get('uuid').setValue(annualOrder.uuid);
      this.annualOrderRelationForm.get('days').setValue(annualOrder.days);
      this.annualOrderRelationForm.get('seniority').setValue(annualOrder.seniority);
    });
  }

  clickSave() {
    const annualLeaveInput = this.annualOrderRelationForm.value;
    this.annualLeaveRelationService.update(annualLeaveInput.uuid, annualLeaveInput).subscribe(result => {
      this.toastService.open({
        type: 'success',
        message: '修改成功'
      });
    }, err => {
      this.toastService.open({
        type: 'danger',
        message: err
      });
    });
  }
}
