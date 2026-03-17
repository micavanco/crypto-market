import { Directive, effect, ElementRef, inject, input } from '@angular/core';

@Directive({
  selector: '[appProfit]',
})
export class ProfitDirective {
  private elementRef = inject(ElementRef);
  public appProfit = input(0);

  constructor() {
    effect(() => {
      if (this.appProfit() < 0) {
        this.elementRef.nativeElement.style.color = 'var(--loss-color)';
      } else {
        this.elementRef.nativeElement.style.color = 'var(--profit-color)';
      }
    });
  }
}
