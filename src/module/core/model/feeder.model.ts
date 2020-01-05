import { DateConverter, JsonProperty } from 'ts-serializer-core';
import { Alarm } from './alarm.model';

export class Feeder {

  @JsonProperty({name: 'id', excludeToJson: true})
  public id: string;

  @JsonProperty('name')
  public name: string;

  @JsonProperty({name: 'alarms', type: Alarm})
  public alarms: Alarm[];

  @JsonProperty({name: 'lastFeedAt', customConverter: DateConverter, excludeFromJson: true})
  public lastFeedAt: Date;

  @JsonProperty('defaultRevolutionCount')
  public defaultRevolutionCount: number;

  public hasAlarm(): boolean {
    return this.alarms && this.alarms.length > 0;
  }

  public findNextAlarm(): Alarm {
    let index: number = -1;
    let i: number = 0;
    const currentTime: Date = new Date();

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
