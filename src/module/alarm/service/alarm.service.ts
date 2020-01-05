import { Injectable } from '@nestjs/common';
import { CronJob } from 'cron';
import { Alarm } from '../../core/model/alarm.model';

@Injectable()
export class AlarmService {

  private cronJob: CronJob;

  public setAlarm(alarm: Alarm, callback: (alarm: Alarm) => void): void {
    if (this.cronJob) {
      this.cronJob.stop();
    }

    const d: Date = alarm.toDate();
    d.setSeconds(0);

    console.log('Next alarm set to ', d);
    this.cronJob = new CronJob(d, () => callback(alarm));
    this.cronJob.start();
  }
}
