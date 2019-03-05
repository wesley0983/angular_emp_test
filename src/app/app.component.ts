import { Component } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = '人事系統';
  mainPage = '1';



  info = {
    email: '',
    password: ''
  };

  show() {
    const myModal = document.getElementsByClassName('myModal');
    // $('#myModal').modal('show');
  }

  turnPage() {

  }
}
