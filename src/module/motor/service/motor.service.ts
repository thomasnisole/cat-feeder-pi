import { Injectable } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { StepperService } from './stepper.service';

@Injectable()
export class MotorService {

  public constructor(private stepper: StepperService) {
    this.stepper.initialize(200, 4, 17, 27, 22);
    this.stepper.setSpeed(60);
  }

  public feed(revolutions: number): Observable<void> {
    return from(this.stepper.steps(-(revolutions * 200))).pipe(
      tap(() => console.log('move complete')),
      map(() => void 0)
    );
  }
}
