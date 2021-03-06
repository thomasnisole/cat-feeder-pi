import {Module} from '@nestjs/common';
import {MotorService} from './service/motor.service';
import {StepperService} from './service/stepper.service';
import {SystemModule} from '../@system/system.module';
import {LoggerModule} from '../logger/logger.module';

@Module({
  imports: [
    LoggerModule,
    SystemModule
  ],
  providers: [
    MotorService,
    StepperService
  ],
  exports: [
    MotorService
  ]
})
export class MotorModule {}
