import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  viewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatFabButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { switchMap } from 'rxjs';
import { IS_MOBILE } from '../../../../core/tokens/mobile.token';
import { UserRole } from '../../../authentication/models/login.interface';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { SessionsApiService } from '../../api/sessions-api.service';
import { SessionsFilters } from '../../models/sessions-filters.interface';
import { CalendarService } from '../../services/calendar.service';
import { UpsertSessionService } from '../../services/upsert-session.service';
import { SessionsStore } from '../../store/sessions.store';
import { SessionsFiltersComponent } from '../sessions-filters/sessions-filters.component';

@Component({
  selector: 'app-sessions-calendar',
  imports: [
    FullCalendarModule,
    MatSidenavModule,
    MatBottomSheetModule,
    MatFabButton,
    MatIconModule,
    MatProgressSpinnerModule,
    SessionsFiltersComponent
  ],
  providers: [CalendarService, SessionsStore, UpsertSessionService],
  templateUrl: './sessions-calendar.component.html',
  styleUrl: './sessions-calendar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionsCalendarComponent {
  readonly #sessionsStore = inject(SessionsStore);
  readonly #sessionsApi = inject(SessionsApiService);
  readonly #calendarService = inject(CalendarService);
  readonly #upsertSessionService = inject(UpsertSessionService);
  readonly #authService = inject(AuthenticationService);

  readonly calendarComponent = viewChild<FullCalendarComponent>('calendar');
  readonly isMobile = inject(IS_MOBILE);
  readonly filtersOpen = signal(false);
  readonly calendarTitle = signal('');
  readonly calendarOptions = this.#calendarService.options;
  readonly clients = this.#sessionsStore.clients;
  readonly coaches = this.#sessionsStore.coaches;
  readonly isLoadingCalendarData = this.#sessionsStore.isLoadingData;

  constructor() {
    effect(() => {
      const calendarComponent = this.calendarComponent();
      if (!calendarComponent) {
        return;
      }

      const calendarApi = calendarComponent.getApi();
      this.#calendarService.setCalendarApi(calendarApi);
    });

    this.#calendarService.dateClicked$
      .pipe(takeUntilDestroyed())
      .subscribe((date) => this.createNewSession(date));

    this.#calendarService.sessionClicked$
      .pipe(
        takeUntilDestroyed(),
        switchMap((sessionId) => this.#sessionsApi.getSessionDetails(sessionId))
      )
      .subscribe((sessionDto) =>
        this.#upsertSessionService.openBottomSheet({
          id: sessionDto.id,
          startDate: sessionDto.startDate,
          endDate: sessionDto.endDate,
          client: this.#sessionsStore.getClientById(sessionDto.clientId),
          coach: this.#sessionsStore.getCoachById(sessionDto.coachId),
          report: sessionDto.report,
          status: sessionDto.status
        })
      );

    this.#calendarService.openFilters$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.filtersOpen.set(true));

    this.#calendarService.viewChanged$
      .pipe(takeUntilDestroyed())
      .subscribe(({ title }) => this.calendarTitle.set(title));
  }

  applyFilters(filters: SessionsFilters): void {
    this.#calendarService.applyFilters(filters);
  }

  createNewSession(date?: Date): void {
    const coach =
      this.#authService.userRole() === UserRole.coach
        ? this.#sessionsStore.getCoachById(this.#authService.userId())
        : undefined;

    this.#upsertSessionService.openBottomSheet({ startDate: date?.getTime(), coach });
  }
}
