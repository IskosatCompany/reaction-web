import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LayoutService {
  readonly isMobile: Signal<boolean>;

  readonly #breakpointObserver = inject(BreakpointObserver);

  constructor() {
    const observer$ = this.#breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(map((result) => result.matches));

    this.isMobile = toSignal(observer$, { initialValue: false });
  }
}
