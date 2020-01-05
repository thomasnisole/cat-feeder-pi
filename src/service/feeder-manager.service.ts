import { Injectable } from '@nestjs/common';
import { FeederService } from '../module/core/service/feeder.service';
import { Feeder } from '../module/core/model/feeder.model';
import { AlarmService } from '../module/alarm/service/alarm.service';
import { filter, first, map, mergeMap, tap } from 'rxjs/operators';
import { Alarm } from '../module/core/model/alarm.model';
import { isEqual, cloneDeep } from 'lodash';
import { MotorService } from '../module/motor/service/motor.service';
import { FeedRequestService } from '../module/core/service/feed-request.service';
import { Observable } from 'rxjs';
import { FeedRequest } from '../module/core/model/feed-request.model';

const FEEDER_ID: string = '0bKutOMy0vFPzLquijXX';

@Injectable()
export class FeederManagerService {

  public constructor(private feederService: FeederService,
                     private feedRequestService: FeedRequestService,
                     private alarmService: AlarmService,
                     private motorService: MotorService) {}

  public synchronize(): void {
    const findById$: Observable<Feeder> = this.feederService.findById(FEEDER_ID);

    findById$.pipe(
      tap((feeder: Feeder) => this.initAlarm(feeder))
    ).subscribe();

    findById$.pipe(
      first(),
      mergeMap((feeder: Feeder) => this.feedRequestService.findByFeederId(feeder.id).pipe(
        filter((feedRequests: FeedRequest[]) => feedRequests.length > 0),
        map((feedRequests: FeedRequest[]) => feedRequests[0]),
        mergeMap((feedRequest: FeedRequest) => this.feed(feeder, feedRequest.revolutionCount).pipe(
          map(() => feedRequest)
        )),
        mergeMap((feedRequest: FeedRequest) => this.feedRequestService.delete(feedRequest))
      ))
    ).subscribe();
  }

  private initAlarm(feeder: Feeder): void {
    if (!feeder.hasAlarm()) {
      return;
    }

    this.alarmService.setAlarm(
      feeder.findNextAlarm(),
      (a: Alarm) => this.feed(feeder, a.revolutionCount).subscribe(
        () => this.initAlarm(feeder)
      )
    );
  }

  private feed(feeder: Feeder, revolutionCount: number): Observable<void> {
    console.log('Feed with ' + revolutionCount);
    return this.motorService.feed(revolutionCount).pipe(
      map(() => cloneDeep(feeder)),
      tap((f: Feeder) => f.lastFeedAt = new Date()),
      mergeMap((f: Feeder) => this.feederService.update(f))
    );
  }
}
