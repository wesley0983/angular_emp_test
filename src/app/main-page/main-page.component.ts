import { Component, OnInit, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  userData: any;
  constructor(
    private activatedRoute: ActivatedRoute,
  ) {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.userData = queryParams;
    });
  }

  ngOnInit() {
  }

  clickSubmit() {

  }

}
