import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { inject, Injectable } from '@angular/core';
import { isSameDay } from 'date-fns';
import { Observable, Subject } from 'rxjs';
import { AuthenticationService } from '../../authentication/services/authentication.service';
import { SessionActionsComponent } from '../components/session-actions/session-actions.component';
import { SessionDto } from '../models/http/session-dto.interface';
import { SessionAction, SessionStatus } from '../models/session.interface';

interface PerformAction {
  sessionDto: SessionDto;
  action: SessionAction;
}

@Injectable()
export class SessionOverlayService {
  readonly #authService = inject(AuthenticationService);
  readonly #overlay = inject(Overlay);
  readonly #performAction = new Subject<PerformAction>();

  #overlayRef: OverlayRef | null = null;

  get performAction$(): Observable<PerformAction> {
    return this.#performAction.asObservable();
  }

  open(element: HTMLElement, sessionDto: SessionDto): void {
    this.close();

    const positionStrategy = this.#overlay
      .position()
      .flexibleConnectedTo(element)
      .withPositions([
        {
          originX: 'center',
          originY: 'center',
          overlayX: 'start',
          overlayY: 'top'
        }
      ]);

    this.#overlayRef = this.#overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'transparent-backdrop'
    });

    const portal = new ComponentPortal(SessionActionsComponent);
    const menu = this.#overlayRef.attach(portal);
    menu.instance.actions = [
      { label: 'Duplicar', action: 'duplicate', icon: 'file_copy' },
      { label: 'Apagar', action: 'delete', icon: 'delete' },
      { label: 'Cliente', action: 'goToClient', icon: 'group' },
      {
        label: 'Concluir',
        action: 'close',
        icon: 'assignment_turned_in',
        tooltip: this.#getCloseActionTooltip(sessionDto),
        disabled:
          sessionDto.status === SessionStatus.Completed ||
          (!isSameDay(sessionDto.startDate, new Date()) && !this.#authService.isAdmin())
      }
    ];
    menu.instance.actionClicked.subscribe((action) => {
      this.#performAction.next({ sessionDto, action });
      this.close();
    });

    this.#overlayRef.backdropClick().subscribe(() => this.close());
  }

  close(): void {
    if (!this.#overlayRef) {
      return;
    }

    this.#overlayRef.dispose();
    this.#overlayRef = null;
  }

  #getCloseActionTooltip(sessionDto: SessionDto): string | undefined {
    if (sessionDto.status === SessionStatus.Completed) {
      return 'Sessão já concluída';
    }

    if (!isSameDay(sessionDto.startDate, new Date()) && !this.#authService.isAdmin()) {
      return 'Sem permissões para concluir a sessão';
    }

    return undefined;
  }
}
