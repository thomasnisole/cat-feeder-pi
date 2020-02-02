import {Converter} from 'ts-serializer-core';
import * as admin from 'firebase-admin';

export class TimestampConverter implements Converter<Date, admin.firestore.Timestamp> {

  public fromJson(value: admin.firestore.Timestamp): Date {
    if (!value) {
      return null;
    }

    if (value instanceof admin.firestore.Timestamp) {
      return value.toDate();
    } else {
      return new Date(value);
    }
  }

  public toJson(value: Date): admin.firestore.Timestamp {
    return admin.firestore.Timestamp.fromDate(value);
  }
}
