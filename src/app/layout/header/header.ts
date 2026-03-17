import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { Theme } from '@core/types/theme.type';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  public theme: InputSignal<Theme> = input('dark' as Theme);
  public themeChanged: OutputEmitterRef<Theme> = output();

  protected onThemeChanged() {
    this.themeChanged.emit(this.theme() === 'light' ? 'dark' : 'light');
  }
}
