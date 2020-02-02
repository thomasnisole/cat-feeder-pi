import {Injectable} from '@nestjs/common';
import {FeederService} from '../module/@core/service/feeder.service';
import {Feeder} from '../module/@core/model/feeder.model';
import {CronService} from '../module/cron/service/cron.service';
import {catchError, filter, first, map, mapTo, switchMap, tap} from 'rxjs/operators';
import {Alarm} from '../module/@core/model/alarm.model';
import {MotorService} from '../module/motor/service/motor.service';
import {FeedRequestService} from '../module/@core/service/feed-request.service';
import {from, Observable, of} from 'rxjs';
import {FeedRequest} from '../module/@core/model/feed-request.model';
import {AlarmService} from '../module/@core/service/alarm.service';
import {FeedRequestStatus} from '../module/@core/model/feed-request-status.enum';
import {LoggerService} from 'nest-logger';
import {softCache} from '@witty-services/rxjs-common';
import {FeedRequestType} from '../module/@core/model/feed-request-type.enum';

const FEEDER_ID: string = 'PseXgNA9V1lheR4GMpul';

@Injectable()
export class FeederManagerService {

  private findById$: Observable<Feeder>;

  public constructor(private feederService: FeederService,
                     private feedRequestService: FeedRequestService,
                     private alarmService: AlarmService,
                     private cronService: CronService,
                     private motorService: MotorService,
                     private loggerService: LoggerService) {
    this.findById$ = this.feederService.findById(FEEDER_ID).pipe(
      tap((feeder: Feeder) => this.loggerService.info(`ID : ${feeder.id}, Name: ${feeder.name}`)),
      softCache()
    );
  }

  public synchronize(): void {
    this.loggerService.info('Feeder starting...');

    this.initializeAlarm();
    this.lookForForcedRequest();
  }

  private initializeAlarm(): void {
    this.findById$.pipe(
      first(),
      switchMap((feeder: Feeder) => this.alarmService.findByFeeder(feeder).pipe(
        tap((alarms: Alarm[]) => feeder.alarms = alarms),
        mapTo(feeder)
      )),
      filter((feeder: Feeder) => feeder.alarms.length > 0)
    ).subscribe((feeder: Feeder) => this.initAlarm(feeder));
  }

  private lookForForcedRequest(): void {
    this.findById$.pipe(
      first(),
      switchMap((feeder: Feeder) => this.feedRequestService.findByFeederAndStatusAndType(
        feeder,
        FeedRequestStatus.WAITING,
        FeedRequestType.FORCED
      )),
      filter((feedRequests: FeedRequest[]) => feedRequests.length > 0),
      map((feedRequests: FeedRequest[]) => feedRequests[0]),
      switchMap((feedRequest: FeedRequest) => this.feed(feedRequest))
    ).subscribe();
  }

  private initAlarm(feeder: Feeder): void {
    this.cronService.setAlarm(
      feeder.findNextAlarm(),
      (a: Alarm) => {
        of(new FeedRequest({feeder, revolutionCount: a.revolutionCount, status: FeedRequestStatus.WAITING, type: FeedRequestType.SCHEDULED})).pipe(
          switchMap((feedRequest: FeedRequest) => this.feedRequestService.create(feedRequest).pipe(
            mapTo(feedRequest),
            catchError((err: Error) => {
              this.loggerService.error(err.message);

              return of(feedRequest);
            })
          )),
          switchMap((feedRequest: FeedRequest) => this.feed(feedRequest)),
          first()
        ).subscribe(() => this.initAlarm(feeder))
      }
    );
  }

  private feed(fr: FeedRequest): Observable<void> {
    return of(fr).pipe(
      switchMap((feedRequest: FeedRequest) => this.feedRequestService.markAsFeeding(feedRequest).pipe(
        mapTo(feedRequest),
        catchError((err: Error) => {
          this.loggerService.error(err.message);

          return of(feedRequest);
        })
      )),
      switchMap((feedRequest: FeedRequest) => from(this.motorService.feed(feedRequest.revolutionCount)).pipe(
        mapTo(feedRequest)
      )),
      switchMap((feedRequest: FeedRequest) => this.feedRequestService.markAsTerminated(feedRequest).pipe(
        catchError((err: Error) => {
          this.loggerService.error(err.message);

          return of(void 0);
        })
      ))
    );
  }
}
