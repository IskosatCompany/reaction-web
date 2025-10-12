import { Observable } from 'rxjs';
import { Coach } from './coach.model';

export interface CoachBottomSheetData {
  coach?: Coach;
  expertiseOptions: Observable<string[]>;
}
