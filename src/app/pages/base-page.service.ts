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
import { connection_Url } from '../services/backStage_URL';

@Injectable()
export class BasePageService {

    loginUser: any = null;
    constructor() {

    }
}

