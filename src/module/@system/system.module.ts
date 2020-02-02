import {Module} from '@nestjs/common';
import {DeserializerService} from './service/deserializer.service';
import {SerializerService} from './service/serializer.service';
import {GPIOService} from './service/gpio.service';

@Module({
  providers: [
    DeserializerService,
    GPIOService,
    SerializerService
  ],
  exports: [
    DeserializerService,
    GPIOService,
    SerializerService
  ]
})
export class SystemModule {}
