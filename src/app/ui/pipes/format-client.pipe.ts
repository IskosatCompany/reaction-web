import { Pipe, PipeTransform } from '@angular/core';
import { Client } from '../../features/clients/models/client.interface';
import { formatClient } from '../helpers/client.helper';

@Pipe({ name: 'formatClient' })
export class FormatClientPipe implements PipeTransform {
  transform(client: Client): string {
    return formatClient(client.name, client.clientNumber);
  }
}
