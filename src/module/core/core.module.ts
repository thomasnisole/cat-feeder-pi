import { Module } from '@nestjs/common';
import { SystemModule } from '../system/system.module';
import { FeederService } from './service/feeder.service';
import { FeedRequestService } from './service/feed-request.service';

@Module({
  imports: [
    SystemModule
  ],
  providers: [
    FeederService,
    FeedRequestService
  ],
  exports: [
    FeederService,
    FeedRequestService
  ]
})
export class CoreModule {}
