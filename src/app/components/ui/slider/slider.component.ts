import { Component, ElementRef, model, output, viewChild } from '@angular/core';
import { Slider } from '../../../types/slider.interface';
import { Subscription, fromEvent, debounceTime, map } from 'rxjs';

const DEBOUNCE_MS: number = 150;

@Component({
  selector: 'app-slider',
  imports: [],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
})
export class SliderComponent {

  slider = model.required<Slider>();
  input = viewChild.required<ElementRef>('sliderInput');
  valueChange = output<number>();

  valueSub!: Subscription;

  ngOnInit(): void {
    this.valueSub = fromEvent(this.input().nativeElement, 'input').pipe(
      debounceTime(DEBOUNCE_MS),
      map(event => Number(((event as Event).target as HTMLInputElement).value))
    ).subscribe(value => this.valueChange.emit(value));
  }

  ngOnDestroy(): void {
    if (this.valueSub) this.valueSub.unsubscribe();
  }

}
