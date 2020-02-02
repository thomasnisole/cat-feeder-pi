import {Module} from '@nestjs/common';
import {CronService} from './service/cron.service';
import {SystemModule} from '../@system/system.module';
import {LoggerModule} from '../logger/logger.module';

@Module({
  imports: [
    LoggerModule,
    SystemModule
  ],
  providers: [
    CronService
  ],
  exports: [
    CronService
  ]
})
export class CronModule {}
