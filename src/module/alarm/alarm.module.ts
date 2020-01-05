import { Module } from '@nestjs/common';
import { AlarmService } from './service/alarm.service';
import { SystemModule } from '../system/system.module';

@Module({
  imports: [
    SystemModule
  ],
  providers: [
    AlarmService
  ],
  exports: [
    AlarmService
  ]
})
export class AlarmModule {}
