import { JsonProperty } from 'ts-serializer-core';
import moment = require('moment');

export class Alarm {

  @JsonProperty('name')
  public name: string;

  @JsonProperty('hour')
  public hour: number;

  @JsonProperty('minute')
  public minute: number;

  @JsonProperty('revolutionCount')
  public revolutionCount: number = 10;

  public toDate(): Date {
    const d: Date = new Date();
    d.setMinutes(this.minute);
    d.setHours(this.hour);

    const momentD: moment.Moment = moment(d);

    while (!momentD.isAfter(moment())) {
      momentD.add(1, 'd');
    }

    return momentD.toDate();
  }
}
