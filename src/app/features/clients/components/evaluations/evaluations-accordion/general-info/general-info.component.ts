import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { EvaluationGeneralInfo } from '../../../../models/evaluation/general-info.model';
import { DatePipe } from '@angular/common';
import { Coach } from '../../../../../coaches/models/coach.model';

@Component({
  selector: 'app-general-info',
  imports: [DatePipe],
  templateUrl: './general-info.component.html',
  styleUrl: './general-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralInfoComponent {
  generalInfo = input<EvaluationGeneralInfo>();
  coaches = input<Coach[]>();

  coachName = computed(() => {
    const coaches = this.coaches();
    const generalInfo = this.generalInfo();

    if (!coaches?.length || !generalInfo?.coachId) {
      return;
    }
    return coaches.find((coach) => coach.id === generalInfo.coachId)?.name || 'Desconhecido';
  });
}
