import { Component, ElementRef, viewChild, model, output } from '@angular/core';
import { Subscription, fromEvent, debounceTime, map } from 'rxjs';
import { SLIDER_DEBOUNCE_MS } from '../../../constants/delays';
import { Slider } from '../../../types/ui/slider.interface';

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
      debounceTime(SLIDER_DEBOUNCE_MS),
      map(event => Number(((event as Event).target as HTMLInputElement).value))
    ).subscribe(value => this.valueChange.emit(value));
  }

  ngOnDestroy(): void {
    if (this.valueSub) this.valueSub.unsubscribe();
  }

}
