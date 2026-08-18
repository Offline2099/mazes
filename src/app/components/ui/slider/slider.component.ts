import { Component, ElementRef, viewChild, input, output } from '@angular/core';
import { Subscription, fromEvent, debounceTime, map } from 'rxjs';
import { Slider } from '../../../types/ui/slider.interface';

const SLIDER_DEBOUNCE_MS = 150;

@Component({
  selector: 'app-slider',
  imports: [],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss'
})
export class SliderComponent {

  slider = input.required<Slider>();
  value = input.required<number>();

  sliderInput = viewChild.required<ElementRef<HTMLInputElement>>('sliderInput');
  
  valueChange = output<number>();

  sub: Subscription | null = null;

  ngOnInit(): void {
    this.sub = fromEvent(this.sliderInput().nativeElement, 'input')
      .pipe(
        debounceTime(SLIDER_DEBOUNCE_MS),
        map(event => Number((event.target as HTMLInputElement).value))
      )
      .subscribe(value => this.valueChange.emit(value));
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

}
