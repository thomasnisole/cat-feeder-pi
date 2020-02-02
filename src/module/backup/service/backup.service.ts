import {Injectable} from '@nestjs/common';
import {Feeder} from '../../@core/model/feeder.model';
import {Observable, of} from 'rxjs';
import * as fs from 'fs';
import {SerializerService} from '../../@system/service/serializer.service';
import {DeserializerService} from '../../@system/service/deserializer.service';
import {map} from 'rxjs/operators';

@Injectable()
export class BackupService {

  public path: string = '/home/pi/.cat-feeder-pi';

  public fileName: string = 'backup.json';

  public constructor(private serializer: SerializerService, private deserializer: DeserializerService) {}

  public save(feeder: Feeder): Observable<void> {
    const filePath: string = `${this.path}/${this.fileName}`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    fs.writeFileSync(filePath, this.serializer.serialize(feeder));

    return of(void 0);
  }

  public restore(): Observable<Feeder> {
    const filePath: string = `${this.path}/${this.fileName}`;
    if (!fs.existsSync(filePath)) {
      throw new Error('No backup founded');
    }

    return of(fs.readFileSync(filePath)).pipe(
      map((data: any) => this.deserializer.deserialize(Feeder, data))
    );
  }
}
