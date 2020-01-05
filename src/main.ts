import { NestFactory } from '@nestjs/core';
import * as admin from 'firebase-admin';
import { AppModule } from './app.module';
import { FeederManagerService } from './service/feeder-manager.service';

admin.initializeApp({
  credential: admin.credential.cert('D:\\Téléchargement\\cat-feeder-66c26-firebase-adminsdk-w41cd-b5103cd999.json')
  // credential: admin.credential.cert('/home/pi/cat-feeder-66c26-firebase-adminsdk-w41cd-b5103cd999.json')
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  app.get(FeederManagerService).synchronize();
}
bootstrap();
