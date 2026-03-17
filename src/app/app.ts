import { Component, effect, ElementRef, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Theme } from '@core/types/theme.type';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  @ViewChild('appContainer', { static: true }) appContainer!: ElementRef;

  protected theme: WritableSignal<Theme> = signal('dark');

  constructor() {
    effect(() => {
      if (this.theme() === 'dark') {
        this.appContainer.nativeElement.setAttribute('data-theme', 'dark');
      } else {
        this.appContainer.nativeElement.removeAttribute('data-theme');
      }
    });
  }


  ngOnInit() {
    const isDarkModePreferred = window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)');

    if (isDarkModePreferred && isDarkModePreferred.matches) {
      this.theme.set('dark');
      this.appContainer.nativeElement.setAttribute('data-theme', 'dark');
    } else {
      this.theme.set('light');
    }
  }
}
