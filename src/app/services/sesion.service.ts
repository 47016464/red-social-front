import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SesionService {
  private iniciarTimerSource = new Subject<void>();
  iniciarTimer$ = this.iniciarTimerSource.asObservable();

  dispararTimer() {
    this.iniciarTimerSource.next();
  }
}