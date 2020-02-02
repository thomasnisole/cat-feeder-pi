import {Injectable} from '@nestjs/common';
import {Deserializer} from 'ts-serializer-core';

@Injectable()
export class DeserializerService {

  private deserializer: Deserializer;

  public constructor() {
    this.deserializer = new Deserializer();
  }

  public deserialize(type: new(...args: any[]) => any, data: any|any[]): any {
    return this.deserializer.deserialize(type, data);
  }
}
