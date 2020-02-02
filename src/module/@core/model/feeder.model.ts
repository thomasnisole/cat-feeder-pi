import {JsonProperty} from 'ts-serializer-core';
import {Alarm} from './alarm.model';

export class Feeder {

  @JsonProperty({name: 'id', excludeToJson: true})
  public id: string;

  @JsonProperty('name')
  public name: string;

  public alarms: Alarm[];

  public hasAlarm(): boolean {
    return this.alarms && this.alarms.length > 0;
  }

  public findNextAlarm(): Alarm {
    let index: number = -1;
    let i: number = 0;
    const currentTime: Date = new Date();
    this.alarms = this.alarms.sort((a: Alarm, b: Alarm) => {
      return a.hour - b.hour || a.minute - b.minute;
    });

    while (i < this.alarms.length && index === -1) {
      if (this.alarms[i].hour < currentTime.getHours()) {
        i++;
        continue;
      }

      if (this.alarms[i].hour === currentTime.getHours()) {
        if (this.alarms[i].minute > currentTime.getMinutes()) {
          index = i;
          continue;
        } else {
          i++;
          continue;
        }
      }

      if (this.alarms[i].hour > currentTime.getHours()) {
        index = i;
      }
    }

    if (index === -1) {
      index = 0;
    }

    return this.alarms[index];
  }
}
