import {NestFactory} from '@nestjs/core';
import * as admin from 'firebase-admin';
import {AppModule} from './app.module';
import {FeederManagerService} from './service/feeder-manager.service';
import {INestApplication} from '@nestjs/common';

admin.initializeApp({
  credential: admin.credential.cert('./cert.json')
  });

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule);
  await app.listen(3000);

  app.get(FeederManagerService).synchronize();
}
bootstrap();
