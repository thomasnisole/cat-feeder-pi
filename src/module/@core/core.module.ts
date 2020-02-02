import {Module} from '@nestjs/common';
import {SystemModule} from '../@system/system.module';
import {FeederService} from './service/feeder.service';
import {FeedRequestService} from './service/feed-request.service';
import {AlarmService} from './service/alarm.service';

@Module({
  imports: [
    SystemModule
  ],
  providers: [
    AlarmService,
    FeederService,
    FeedRequestService
  ],
  exports: [
    AlarmService,
    FeederService,
    FeedRequestService
  ]
})
export class CoreModule {}
