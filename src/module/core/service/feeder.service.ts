import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { from, Observable, Observer } from 'rxjs';
import { distinctUntilChanged, first, map, shareReplay, tap } from 'rxjs/operators';
import { DeserializerService } from '../../system/service/deserializer.service';
import { Feeder } from '../model/feeder.model';
import { SerializerService } from '../../system/service/serializer.service';
import { isEqual } from 'lodash';

@Injectable()
export class FeederService {

  private findById$: Map<string, Observable<Feeder>> = new Map<string, Observable<Feeder>>();

  private db: FirebaseFirestore.Firestore;

  public constructor(private deserializerService: DeserializerService,
                     private serializerService: SerializerService) {
    this.db = admin.firestore();
  }

  public findById(id: string): Observable<Feeder> {
    if (!this.findById$.has(`/feeders/${id}`)) {
      this.findById$.set(
        `/feeders/${id}`,
        new Observable((observer: Observer<FirebaseFirestore.DocumentSnapshot>) => {
          this.db.collection('/feeders').doc(id).onSnapshot(
            (doc: FirebaseFirestore.DocumentSnapshot) => observer.next(doc),
            (err: Error) => observer.error(err)
          );
        }).pipe(
          map((doc: FirebaseFirestore.DocumentSnapshot) => ({id: doc.id, ...doc.data()})),
          map((data: {id: string}) => this.deserializerService.deserialize(Feeder, data)),
          distinctUntilChanged((prev: Feeder, curr: Feeder) => isEqual(prev, curr)),
          tap(console.log),
          shareReplay(1)
        )
      );
    }

    return this.findById$.get(`/feeders/${id}`);
  }

  public update(feeder: Feeder): Observable<void> {
    return from(this.db.doc(`/feeders/${feeder.id}`).update(this.serializerService.serialize(feeder))).pipe(
      first(),
      map(() => void 0)
    );
  }
}
