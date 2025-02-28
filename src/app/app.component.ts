import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {InputMask} from 'primeng/inputmask';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ButtonModule,
    InputMask,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'babe-pass';
  phoneNumber: string = '';
}
