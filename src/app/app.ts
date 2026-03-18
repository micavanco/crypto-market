import { Component, effect, ElementRef, inject, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Theme } from '@core/types/theme.type';
import { AppStore } from '@core/stores/app.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  #appStore = inject(AppStore);

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
    this.#appStore.loadData();
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
