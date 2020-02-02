import {Injectable} from '@nestjs/common';
import {CronJob} from 'cron';
import {Alarm} from '../../@core/model/alarm.model';
import {LoggerService} from 'nest-logger';

@Injectable()
export class CronService {

  private cronJob: CronJob;

  public constructor(private readonly loggerService: LoggerService) {}

  public setAlarm(alarm: Alarm, callback: (alarm: Alarm) => void): void {
    if (this.cronJob) {
      this.cronJob.stop();
    }

    const d: Date = alarm.toDate();
    d.setSeconds(0);

    this.loggerService.info(`Next cron set to ${d.toLocaleString('fr')}`);
    this.cronJob = new CronJob(d, () => callback(alarm));
    this.cronJob.start();
  }
}
