import { Injectable } from '@nestjs/common';
import { FeedRequest } from '../model/feed-request.model';
import { from, Observable, Observer } from 'rxjs';
import { DeserializerService } from '../../system/service/deserializer.service';
import * as admin from 'firebase-admin';
import { map, mergeMap, shareReplay, tap, toArray } from 'rxjs/operators';

@Injectable()
export class FeedRequestService {

  private findByFeederId$: Map<string, Observable<FeedRequest[]>> = new Map<string, Observable<FeedRequest[]>>();

  private db: FirebaseFirestore.Firestore;

  public constructor(private deserializerService: DeserializerService) {
    this.db = admin.firestore();
  }

  public findByFeederId(feederId: string): Observable<FeedRequest[]> {
    if (!this.findByFeederId$.has(`/feeders/${feederId}/feed-requests`)) {
      this.findByFeederId$.set(
        `/feeders/${feederId}/feed-requests`,
        new Observable((observer: Observer<FirebaseFirestore.QueryDocumentSnapshot[]>) => {
          this.db.collection(`/feeders/${feederId}/feed-requests`).onSnapshot(
            (qs: FirebaseFirestore.QuerySnapshot) => observer.next(qs.docs),
            (err: Error) => observer.error(err)
          );
        }).pipe(
          mergeMap((qds: FirebaseFirestore.QueryDocumentSnapshot[]) => from(qds).pipe(
            map((ds: FirebaseFirestore.QueryDocumentSnapshot) => ({ id: ds.id, ...ds.data() })),
            map((data: {id: string}) => this.deserializerService.deserialize(FeedRequest, data)),
            tap((feedRequest: FeedRequest) => feedRequest.feederId = feederId),
            toArray(),
          )),
          shareReplay(1)
        )
      );
    }

    return this.findByFeederId$.get(`/feeders/${feederId}/feed-requests`);
  }

  public delete(feedRequest: FeedRequest): Observable<void> {
    return from(this.db.doc(`/feeders/${feedRequest.feederId}/feed-requests/${feedRequest.id}`).delete()).pipe(
      map(() => void 0)
    );
  }
}
