import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import { _throw } from 'rxjs/observable/throw';
import { bufferCount } from 'rxjs/operators/bufferCount';
import { catchError } from 'rxjs/operators/catchError';
import { concatMap } from 'rxjs/operators/concatMap';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { zip } from 'rxjs/observable/zip';
import { toArray } from 'rxjs/operators/toArray';
import { connection_Url } from './backStage_URL';

@Injectable()
export class LeaveOrdersService {

    constructor(
        private httpClient: HttpClient,
    ) {

    }

    getAllPageable(query): Observable<any> {
        const url = `${connection_Url}/leaveOrders`;
        return this.httpClient.get(url, {
            params: query,
        }).pipe(
            catchError((error: any) => _throw('載入假單紀錄失敗'))
        );
    }

    leaveOrderApply(leaveOrderItem: any): Observable<any> {
        const param = {
            ...leaveOrderItem,
        };
        const url = `${connection_Url}/leaveOrders`;
        return this.httpClient.post(url, param)
            .pipe(
                catchError((error: any) => {
                    return _throw('申請失敗');
                })
            );
    }
    update(leaveOrderUuid: string, leaveOrderItem: any): Observable<any> {
        const url = `${connection_Url}/leaveOrders/${leaveOrderUuid}`;
        return this.httpClient.patch(url, leaveOrderItem)
            .pipe(
                catchError((error: any) => {
                    return _throw('更新假單失敗');
                })
            );
    }
    batchStatusPass(leaveOrderItems: Array<any>): Observable<any> {
        return zip(
            ...leaveOrderItems.map(leaveOrderItem => {
                leaveOrderItem.status = '2';
                return this.update(leaveOrderItem.uuid, leaveOrderItem);
            })
        );
    }
    batchStatusNoPass(leaveOrderItems: Array<any>): Observable<any> {
        return zip(
            ...leaveOrderItems.map(leaveOrderItem => {
                leaveOrderItem.status = '3';
                return this.update(leaveOrderItem.uuid, leaveOrderItem);
            })
        );
    }
}

