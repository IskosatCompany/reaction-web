import { Directive, effect, inject, input } from '@angular/core';
import { Coach } from '../../features/coaches/models/coach.model';
import { SearchableSelectComponent } from '../components/searchable-select/searchable-select.component';
import { formatCoach } from '../helpers/coach.helper';

@Directive({ selector: '[appCoachSelect]' })
export class CoachSelectDirective {
  readonly #component = inject(SearchableSelectComponent<Coach>);

  coaches = input.required<Coach[]>({ alias: 'appCoachSelect' });

  constructor() {
    effect(() => {
      const items = this.coaches();

      this.#component.items = items;
      this.#component.valueKey = 'id';
      this.#component.displayFn = (coach) => formatCoach(coach.name, coach.employeeNumber);
      this.#component.label = 'Treinador';
      this.#component.placeholder = 'Pesquisar treinador';
    });
  }
}
