import { Component, HostListener, input, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { Checkbox } from '../../../types/ui/checkbox.interface';

@Component({
  selector: 'app-checkbox',
  imports: [NgClass],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
})
export class CheckboxComponent {

  @HostListener('click') onClick() {
    this.valueChange.emit(!this.checkbox().value);
  }

  checkbox = input.required<Checkbox>();
  valueChange = output<boolean>();

}
