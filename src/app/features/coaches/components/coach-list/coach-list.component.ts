import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CardComponent } from '../../../../ui/components/card/card.component';
import { TableComponent } from '../../../../ui/components/table/table.component';
import { CoachApiService } from '../../api/coach-api.service';
import { IS_MOBILE } from '../../../../core/tokens/mobile.token';
import { Router } from '@angular/router';
import {
  PaginatedTableDataSource,
  TableColumn,
  TableRowAction
} from '../../../../ui/components/table/table.model';
import { Coach, CoachForm } from '../../models/coach.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { filter, Observable, startWith, Subject, switchMap } from 'rxjs';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CoachFormComponent } from '../coach-form/coach-form.component';
import { CoachBottomSheetData } from '../../models/coach-bottom-sheet-data.model';

@Component({
  selector: 'app-coach-list',
  imports: [TableComponent, CardComponent, AsyncPipe, MatButtonModule, MatIconModule],
  providers: [CoachApiService],
  templateUrl: './coach-list.component.html',
  styleUrl: './coach-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoachListComponent {
  isMobile = inject(IS_MOBILE);
  bottomSheet = inject(MatBottomSheet);
  router = inject(Router);
  coachApiService = inject(CoachApiService);
  createCoachSubject$ = new Subject<void>();
  refreshSubject$ = new Subject<void>();
  columns: TableColumn<Coach>[] = [
    { id: 'name', label: 'Nome' },
    { id: 'email', label: 'Email' },
    { id: 'phoneNumber', label: 'Telefone' }
  ];

  dataSource: PaginatedTableDataSource<Coach> = {
    data$: this.refreshSubject$.pipe(
      startWith(null),
      switchMap(() => this.coachApiService.getCoaches())
    )
  };

  actions: TableRowAction<Coach>[] = [
    {
      id: 'action',
      icon: 'open_in_new',
      tooltip: () => 'Ver detalhes',
      callback: (row) => {
        this.router.navigate(['team', row.id]);
      }
    }
  ];

  constructor() {
    this.createCoachSubject$
      .pipe(
        switchMap(() => this.openCreateCoachBottomSheet()),
        filter((coachForm) => !!coachForm),
        switchMap((coachForm) => this.coachApiService.addCoach(coachForm))
      )
      .subscribe(() => this.refreshSubject$.next());
  }

  onCoachClick(coachId: string): void {
    this.router.navigate(['coaches', coachId]);
  }

  createCoach(): void {
    this.createCoachSubject$.next();
  }

  openCreateCoachBottomSheet(): Observable<Partial<CoachForm> | undefined> {
    return this.bottomSheet
      .open<CoachFormComponent, CoachBottomSheetData, Partial<CoachForm>>(CoachFormComponent, {
        data: {
          expertiseOptions: this.coachApiService.getExpertises()
        }
      })
      .afterDismissed();
  }
}
