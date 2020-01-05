import { Module } from '@nestjs/common';
import { MotorService } from './service/motor.service';
import { StepperService } from './service/stepper.service';
import { SystemModule } from '../system/system.module';

@Module({
  imports: [
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
