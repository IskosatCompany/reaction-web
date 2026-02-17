import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState
} from '@ngrx/signals';
import { delay, finalize, map } from 'rxjs';
import { AuthenticationService } from '../../authentication/services/authentication.service';
import { ClientsApiService } from '../../clients/api/clients-api.service';
import { Client } from '../../clients/models/client.interface';
import { CoachApiService } from '../../coaches/api/coach-api.service';
import { Coach } from '../../coaches/models/coach.model';
import { SessionsApiService } from '../api/sessions-api.service';

interface SessionsState {
  clients: Client[];
  _clientsStatus: 'LOADING' | 'LOADED';
  coaches: Coach[];
  _coachesStatus: 'LOADING' | 'LOADED';
  sessionTypes: string[];
  _sessionTypesStatus: 'LOADING' | 'LOADED';
}

const initialState: SessionsState = {
  clients: [],
  _clientsStatus: 'LOADING',
  coaches: [],
  _coachesStatus: 'LOADING',
  sessionTypes: [],
  _sessionTypesStatus: 'LOADING'
};

export const SessionsStore = signalStore(
  withState(initialState),
  withComputed(({ _clientsStatus, _coachesStatus, _sessionTypesStatus }) => ({
    isLoadingData: computed(
      () =>
        _clientsStatus() === 'LOADING' ||
        _coachesStatus() === 'LOADING' ||
        _sessionTypesStatus() === 'LOADING'
    )
  })),
  withMethods(
    (
      store,
      clientsApiService = inject(ClientsApiService),
      coachesApiService = inject(CoachApiService),
      sessionsApiService = inject(SessionsApiService),
      authenticationService = inject(AuthenticationService)
    ) => ({
      _loadClients(): void {
        clientsApiService
          .getClients()
          .pipe(
            delay(1000),
            finalize(() => patchState(store, { _clientsStatus: 'LOADED' }))
          )
          .subscribe((clients) => patchState(store, { clients }));
      },
      _loadCoaches(): void {
        const coachesRequest$ = authenticationService.isAdmin()
          ? coachesApiService.getCoaches()
          : coachesApiService
              .getCoachDetails(authenticationService.userId())
              .pipe(map((item) => [item]));

        coachesRequest$
          .pipe(finalize(() => patchState(store, { _coachesStatus: 'LOADED' })))
          .subscribe((coaches) => patchState(store, { coaches }));
      },
      _loadSessionTypes(): void {
        sessionsApiService
          .getSessionTypes()
          .subscribe((sessionTypes) =>
            patchState(store, { sessionTypes, _sessionTypesStatus: 'LOADED' })
          );
      },
      getClientById(clientId: string): Client {
        const client = store.clients().find((item) => item.id === clientId);
        if (!client) {
          throw new Error('Client not found');
        }

        return client;
      },
      getCoachById(coachId: string): Coach {
        const coach = store.coaches().find((item) => item.id === coachId);
        if (!coach) {
          throw new Error('Coach not found');
        }

        return coach;
      }
    })
  ),
  withHooks({
    onInit(store) {
      store._loadClients();
      store._loadCoaches();
      store._loadSessionTypes();
    }
  })
);
