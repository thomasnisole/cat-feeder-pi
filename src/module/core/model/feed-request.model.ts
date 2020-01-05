import { JsonProperty } from 'ts-serializer-core';

export class FeedRequest {

  @JsonProperty({name: 'id', excludeToJson: true})
  public id: string;

  @JsonProperty('revolutionCount')
  public revolutionCount: number = 10;

  public feederId: string;
}
