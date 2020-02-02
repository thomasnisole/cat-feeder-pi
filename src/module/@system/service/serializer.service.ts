import {Injectable} from '@nestjs/common';
import {Serializer} from 'ts-serializer-core';

@Injectable()
export class SerializerService {

  private serializer: Serializer;

  public constructor() {
    this.serializer = new Serializer(null);
  }

  public serialize(data: any|any[]): any {
    return this.serializer.serialize(data);
  }
}
