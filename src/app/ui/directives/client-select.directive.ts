import { Directive, effect, inject, input } from '@angular/core';
import { Client } from '../../features/clients/models/client.interface';
import { SearchableSelectComponent } from '../components/searchable-select/searchable-select.component';
import { formatClient } from '../helpers/client.helper';

@Directive({ selector: '[appClientSelect]' })
export class ClientSelectDirective {
  readonly #component = inject(SearchableSelectComponent<Client>);

  clients = input.required<Client[]>({ alias: 'appClientSelect' });

  constructor() {
    effect(() => {
      const items = this.clients();

      this.#component.items = items;
      this.#component.valueKey = 'id';
      this.#component.displayFn = (client) => formatClient(client.name, client.clientNumber);
      this.#component.label = 'Cliente';
      this.#component.placeholder = 'Pesquisar cliente';
    });
  }
}
