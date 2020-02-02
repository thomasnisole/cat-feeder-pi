import {JsonProperty} from 'ts-serializer-core';
import {Feeder} from './feeder.model';
import {FeedRequestStatus} from './feed-request-status.enum';
import {FeedRequestType} from './feed-request-type.enum';
import {TimestampConverter} from '../../@system/converter/timestamp.converter';

export class FeedRequest {

  @JsonProperty({name: 'id', excludeToJson: true})
  public id: string;

  @JsonProperty('revolutionCount')
  public revolutionCount: number = 10;

  @JsonProperty('status')
  public status: FeedRequestStatus;

  @JsonProperty('type')
  public type: FeedRequestType;

  @JsonProperty({name: 'createdAt', customConverter: TimestampConverter})
  public createdAt: Date = new Date();

  @JsonProperty({name: 'updatedAt', customConverter: TimestampConverter})
  public updatedAt: Date = new Date();

  public feeder: Feeder;

  public constructor(datas?: Partial<FeedRequest>) {
    if (datas) {
      Object.assign(this, datas);
    }
  }
}
