import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import { _throw } from 'rxjs/observable/throw';
import { bufferCount } from 'rxjs/operators/bufferCount';
import { catchError } from 'rxjs/operators/catchError';
import { concatMap } from 'rxjs/operators/concatMap';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { toArray } from 'rxjs/operators/toArray';
import { connection_Url } from './backStage_URL';

@Injectable()
export class EmployeeService {

    constructor(
        private httpClient: HttpClient,
    ) {

    }

    getAllPageable(params: any, pager: any): Observable<any> {
        const fields = [
            'uuid',
            'no',
            'name',
            'sex',
            'phone',
            'email',
            'password',
            'adminFlag',
        ];
        const query = {
            ...pager,
            rsql: Object.keys(params)
                .filter(key => params[key])
                .map(key => params[key])
                .join(';'),
            fields: fields.join(),
            sort: '-endTime'
        };
        const url = `${connection_Url}/employees`;
        return this.httpClient.get(url).pipe(
            catchError((error: any) => _throw('載入員工失敗'))
        );
    }

    getOne(uuid: any): Observable<any> {
        const url = `${connection_Url}/employees/${uuid}`;
        return this.httpClient.get(url).pipe(
            catchError((error: any) => _throw('載入員工失敗'))
        );
    }

    getOneByUserLogin(userInfo: any): Observable<any> {
        const url = `${connection_Url}/employees/login`; 
        return this.httpClient.post(url, userInfo).pipe(
            catchError((error: any) => _throw('帳號或密碼有錯'))
        );
    }

    add(params: any): Observable<any> {
        const url = `${connection_Url}/employees`;
        return this.httpClient.post(url, params)
            .pipe(
                catchError((error: any) => {
                    return _throw('新增員工失敗');
                })
            );
    }

    update(itemUuid: string, employeeItem: any): Observable<any> {
        const url = `${connection_Url}/employees/${itemUuid}`;
        return this.httpClient.patch(url, employeeItem)
            .pipe(
                catchError((error: any) => {
                    return _throw('更新員工失败');
                })
            );
    }

    delete(uuid: string): Observable<any> {
        const url = `${connection_Url}/employees/${uuid}`;
        return this.httpClient.delete(url);
    }

    batchDelete(uuids: Array<any>): Observable<any> {
        return from(uuids).pipe(
            mergeMap(uuid => this.delete(uuid)),
            toArray()
        );
    }
}

