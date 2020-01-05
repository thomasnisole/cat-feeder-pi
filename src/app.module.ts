import { Module } from '@nestjs/common';
import { CoreModule } from './module/core/core.module';
import { SystemModule } from './module/system/system.module';
import { FeederManagerService } from './service/feeder-manager.service';
import { AlarmModule } from './module/alarm/alarm.module';
import { MotorModule } from './module/motor/motor.module';

@Module({
  imports: [
    AlarmModule,
    CoreModule,
    MotorModule,
    SystemModule
  ],
  providers: [
    FeederManagerService
  ],
})
export class AppModule {}
