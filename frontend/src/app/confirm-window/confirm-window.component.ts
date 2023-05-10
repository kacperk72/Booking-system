import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-confirm-window',
  templateUrl: './confirm-window.component.html',
  styleUrls: ['./confirm-window.component.css'],
})
export class ConfirmWindowComponent {
  @Input() actualElement: any;
}
