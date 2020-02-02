import {Injectable} from '@nestjs/common';
import {Alarm} from '../model/alarm.model';
import {from, Observable, Observer} from 'rxjs';
import {Feeder} from '../model/feeder.model';
import {DeserializerService} from '../../@system/service/deserializer.service';
import * as admin from 'firebase-admin';
import {map, switchMap, toArray} from 'rxjs/operators';
import {softCache} from '@witty-services/rxjs-common';

@Injectable()
export class AlarmService {

  private db: FirebaseFirestore.Firestore;

  public constructor(private deserializerService: DeserializerService) {
    this.db = admin.firestore();
  }

  public findByFeeder(feeder: Feeder): Observable<Alarm[]> {
    return new Observable((observer: Observer<FirebaseFirestore.QueryDocumentSnapshot[]>) => {
      this.db.collection(`/feeders/${feeder.id}/alarms`).onSnapshot(
        (qs: FirebaseFirestore.QuerySnapshot) => observer.next(qs.docs),
        (err: Error) => observer.error(err)
      );
    }).pipe(
      switchMap((qds: FirebaseFirestore.QueryDocumentSnapshot[]) => from(qds).pipe(
        map((ds: FirebaseFirestore.QueryDocumentSnapshot) => ({ id: ds.id, ...ds.data() })),
        map((data: {id: string}) => this.deserializerService.deserialize(Alarm, data)),
        toArray(),
      )),
      softCache()
    );
  }
}
