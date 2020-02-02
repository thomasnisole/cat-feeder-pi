import {Module} from '@nestjs/common';
import {CoreModule} from './module/@core/core.module';
import {SystemModule} from './module/@system/system.module';
import {FeederManagerService} from './service/feeder-manager.service';
import {CronModule} from './module/cron/cron.module';
import {MotorModule} from './module/motor/motor.module';
import {LoggerModule} from './module/logger/logger.module';

@Module({
  imports: [
    CronModule,
    CoreModule,
    LoggerModule,
    MotorModule,
    SystemModule
  ],
  providers: [
    FeederManagerService
  ],
})
export class AppModule {}
