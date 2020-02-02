import {Injectable} from '@nestjs/common';
import {FeedRequest} from '../model/feed-request.model';
import {from, Observable, Observer} from 'rxjs';
import {DeserializerService} from '../../@system/service/deserializer.service';
import * as admin from 'firebase-admin';
import {map, switchMap, tap, toArray} from 'rxjs/operators';
import {Feeder} from '../model/feeder.model';
import {softCache} from '@witty-services/rxjs-common';
import {FeedRequestStatus} from '../model/feed-request-status.enum';
import {SerializerService} from '../../@system/service/serializer.service';
import {FeedRequestType} from '../model/feed-request-type.enum';

@Injectable()
export class FeedRequestService {

  private db: FirebaseFirestore.Firestore;

  public constructor(private deserializerService: DeserializerService,
                     private serializerService: SerializerService) {
    this.db = admin.firestore();
  }

  public findByFeederAndStatusAndType(feeder: Feeder, status: FeedRequestStatus, type: FeedRequestType): Observable<FeedRequest[]> {
    return new Observable((observer: Observer<FirebaseFirestore.QueryDocumentSnapshot[]>) => {
      this.db
        .collection(`/feeders/${feeder.id}/feed-requests`)
        .where('status', '==', status)
        .where('type', '==', type).onSnapshot(
          (qs: FirebaseFirestore.QuerySnapshot) => observer.next(qs.docs),
          (err: Error) => observer.error(err)
        );
    }).pipe(
      switchMap((qds: FirebaseFirestore.QueryDocumentSnapshot[]) => from(qds).pipe(
        map((ds: FirebaseFirestore.QueryDocumentSnapshot) => ({ id: ds.id, ...ds.data() })),
        map((data: {id: string}) => this.deserializerService.deserialize(FeedRequest, data)),
        tap((feedRequest: FeedRequest) => feedRequest.feeder = feeder),
        toArray(),
      )),
      softCache()
    );
  }

  public markAsFeeding(feedRequest: FeedRequest): Observable<void> {
    feedRequest.status = FeedRequestStatus.FEEDING;

    return this.update(feedRequest);
  }

  public markAsTerminated(feedRequest: FeedRequest): Observable<void> {
    feedRequest.status = FeedRequestStatus.TERMINATED;

    return this.update(feedRequest);
  }

  public create(feedRequest: FeedRequest): Observable<FeedRequest> {
    feedRequest.createdAt = new Date();
    feedRequest.updatedAt = new Date();

    return from(
      this.db.collection(`/feeders/${feedRequest.feeder.id}/feed-requests`).add(this.serializerService.serialize(feedRequest))
    ).pipe(
      map((ref: FirebaseFirestore.DocumentReference<any>) => ref.id),
      tap((id: string) => feedRequest.id = id),
      map(() => feedRequest)
    );
  }

  public update(feedRequest: FeedRequest): Observable<void> {
    feedRequest.updatedAt = new Date();

    return from(
      this.db.doc(`/feeders/${feedRequest.feeder.id}/feed-requests/${feedRequest.id}`).update(this.serializerService.serialize(feedRequest))
    ).pipe(
      map(() => void 0)
    );
  }
}
