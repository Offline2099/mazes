import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  host: { '(click)': 'onClick()' },
  imports: [],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss'
})
export class CheckboxComponent {

  text = input.required<string>();
  value = input.required<boolean>();
  valueChange = output<boolean>();

  onClick() {
    this.valueChange.emit(!this.value());
  }

}
