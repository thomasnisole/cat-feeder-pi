import {Injectable} from '@nestjs/common';
import {StepperService} from './stepper.service';
import {LoggerService} from 'nest-logger';

@Injectable()
export class MotorService {

  public constructor(private stepper: StepperService,
                     private readonly loggerService: LoggerService) {
    this.stepper.initialize(200, 6, 13, 19, 26);
    this.stepper.setSpeed(60);
  }

  public async feed(revolutions: number): Promise<void> {
    this.loggerService.info('Feed');

    for (let i: number = 0; i < revolutions; i++) {
      this.loggerService.debug(-200);
      await this.stepper.steps(-200);
      this.loggerService.debug(100);
      await this.stepper.steps(100);
    }

    this.loggerService.info('Move complete');
  }
}
