import { Pipe, PipeTransform } from '@angular/core';
import { Coach } from '../../features/coaches/models/coach.model';
import { formatCoach } from '../helpers/coach.helper';

@Pipe({ name: 'formatCoach' })
export class FormatCoachPipe implements PipeTransform {
  transform(coach: Coach): string {
    return formatCoach(coach.name, coach.employeeNumber);
  }
}
