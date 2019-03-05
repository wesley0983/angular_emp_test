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
export class AnnualLeaveRelationService {

    constructor(
        private httpClient: HttpClient,
    ) {

    }

    getAllPageable(): Observable<any> {
        const url = `${connection_Url}/annualLeaveRelations`;
        return this.httpClient.get(url).pipe(
            catchError((error: any) => _throw('載入特休對應表失敗'))
        );
    }

    getOne(employeeUuid: string): Observable<any> {
        const url = `${connection_Url}/annualLeaveRelations/${employeeUuid}/getAnnualLeave`;
        return this.httpClient.get(url).pipe(
            catchError((error: any) => _throw('載入個人特休對應表失敗'))
        );
    }

    add(params: any): Observable<any> {
        const url = `${connection_Url}/annualLeaveRelations`;
        return this.httpClient.post(url, params)
            .pipe(
                catchError((error: any) => {
                    return _throw('新增特休對應表失敗');
                })
            );
    }

    update(uuid: string, annualLeaveItem: any): Observable<any> {
        const url = `${connection_Url}/annualLeaveRelations/${uuid}`;
        return this.httpClient.patch(url, annualLeaveItem).pipe(
            catchError((error: any) => _throw('修改特休對應表失敗'))
        );
    }

}

