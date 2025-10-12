import { Observable } from 'rxjs';

export interface ConfirmAction {
  beforeClose: (response: boolean) => Observable<boolean>;
  message: string;
  actionButtonLabel: string;
  id: string;
}
