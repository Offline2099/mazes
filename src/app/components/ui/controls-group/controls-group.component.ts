import { Component, HostBinding, input } from '@angular/core';

@Component({
  selector: 'app-controls-group',
  imports: [],
  templateUrl: './controls-group.component.html',
  styleUrl: './controls-group.component.scss',
})
export class ControlsGroupComponent {

  @HostBinding('class.collapsed') isCollapsed: boolean = true;

  header = input.required<string>();

  toggleGroup(): void {
    this.isCollapsed = !this.isCollapsed;
  }

}
