import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatNumber' })
export class FormatNumberPipe implements PipeTransform {
  transform(value: number, precision: number): number {
    if (!value) {
      return 0;
    }

    return parseFloat(value.toFixed(precision));
  }
}
