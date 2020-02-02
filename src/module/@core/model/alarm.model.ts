import {JsonProperty} from 'ts-serializer-core';
import moment = require('moment');
import {Moment} from 'moment';

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
    const m: Moment = moment();
    const mCompare: Moment = m.clone();
    m.minute(this.minute);
    m.hour(this.hour);

    while (!m.isAfter(mCompare)) {
      m.add(1, 'd');
    }

    return m.toDate();
  }
}
