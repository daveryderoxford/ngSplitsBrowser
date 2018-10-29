/** Service to paganate Firebase queries */
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/take';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

export interface QueryConfig {
  path: string; //  path to collection
  field: string; // field to orderBy
  limit: number; // limit per query
  reverse: boolean; // reverse order?
  prepend: boolean; // prepend to source?
}

@Injectable({
  providedIn: 'root',
})
export class PaganationService<T> {

  // Source data
  private _done = new BehaviorSubject<boolean>(false);
  private _loading = new BehaviorSubject<boolean>(false);
  private _data = new BehaviorSubject<T[]>([]);

  private query: QueryConfig;

  // Observable data
  data: Observable<T[]>;
  done: Observable<boolean> = this._done.asObservable();
  loading: Observable<boolean> = this._loading.asObservable();

  private _cursor: firebase.firestore.QueryDocumentSnapshot;

  constructor(private afs: AngularFirestore) { }

  // Initial query sets options and defines the Observable
  // passing opts will override the defaults
  init(path: string, field: string, opts?: any) {

    this._cursor = null;
    this._data.next([]);
    this._done.next(false);

    this.query = {
      path,
      field,
      limit: 2,
      reverse: false,
      prepend: false,
      ...opts
    };

    const first = this.afs.collection(this.query.path, ref => {
      return ref
        .orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
        .limit(this.query.limit);
    });

    this.mapAndUpdate(first);

    // Create the observable array for consumption in components
    this.data = this._data.asObservable();

  }


  /**  Retrieves additional data from firestore */
  more() {
    const cursor = this._cursor;

    const more = this.afs.collection(this.query.path, ref => {
      return ref
        .orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
        .limit(this.query.limit)
        .startAfter(cursor);
    });
    this.mapAndUpdate(more);
  }

  // Maps the snapshot to usable format the updates source
  private mapAndUpdate(col: AngularFirestoreCollection<any>) {

    if (this._done.value || this._loading.value) { return; }

    // loading
    this._loading.next(true);

    // Map snapshot with doc ref (needed for cursor)
    return col.snapshotChanges()
      .do(arr => {
         let values = arr.map(snap =>  snap.payload.doc.data() as T );

        if (arr.length > 0) {
          this._cursor = arr[arr.length - 1].payload.doc;
        }

        // If prepending, reverse the batch order
        values = this.query.prepend ? values.reverse() : values;

        // try concating the values
        const allValues = this.query.prepend ?  values.concat(this._data.value) : this._data.value.concat(values);

        console.log('values: ' + values.length);
        console.log('allValues: ' + allValues.length);

        // update source with new values, done loading
        this._data.next(allValues);
        this._loading.next(false);

        // no more values, mark done
        if (!values.length) {
          this._done.next(true);
        }
      })
      .take(1)
      .subscribe();
  }
}