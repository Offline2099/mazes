import { Component, input } from '@angular/core';

@Component({
  selector: 'app-controls-group',
  host: { '[class.collapsed]': 'isCollapsed' },
  imports: [],
  templateUrl: './controls-group.component.html',
  styleUrl: './controls-group.component.scss'
})
export class ControlsGroupComponent {

  header = input.required<string>();

  isCollapsed = true;

  toggleGroup(): void {
    this.isCollapsed = !this.isCollapsed;
  }

}
