import { Directive, ElementRef, forwardRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subject } from 'rxjs';
import { QueryLogical } from './query-logical.enum';
import { QueryOperator } from './query-operator.enum';


@Directive({
    selector: 'input[ioneQueryLogical],input[ioneQueryOperator],input[ioneQueryNames],select[ioneQueryLogical],select[ioneQueryOperator],select[ioneQueryNames]',
    host: {
        '(input)': 'input($event.target.value)',
        '(change)': 'input($event.target.value)',
        '(blur)': 'onTouched()'
    },
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => QureyObjectAccessorDirective),
            multi: true
        }
    ]
})
export class QureyObjectAccessorDirective implements ControlValueAccessor, OnInit, OnDestroy {


    private _ngUnsubscribe: Subject<any> = new Subject<any>();
    private inputText = new Subject<string>();

    onChange = (_) => { };
    onTouched = () => { };
    private regExp: RegExp;
    @Input('name') name: any;
    private _queryLogical = ';';
    @Input('ioneQueryLogical') set queryLogical(value: QueryLogical) {
        switch (value) {
            case QueryLogical.AND:
                this._queryLogical = ';';
                break;
            case QueryLogical.OR:
                this._queryLogical = ',';
                break;
            default:
                this._queryLogical = ';';
        }
        this.buildRegExp();
        setTimeout(() => this.onChange(this._elementRef.nativeElement.value));
    }
    private _queryOperator: QueryOperator = QueryOperator.EQUAL_TO;
    @Input('ioneQueryOperator') set queryOperator(value: QueryOperator) {
        this._queryOperator = value;
        this.buildRegExp();
        setTimeout(() => this.onChange(this._elementRef.nativeElement.value));
    }
    private _queryNames: Array<any> = [];
    @Input('ioneQueryNames') set queryNames(value: any) {
        if (value && value.constructor === String) {
            this._queryNames = [value];
        } else if (value && value.constructor === Array) {
            this._queryNames = value;
        } else if (value && value.constructor === Object) {
            this._queryNames = Object.keys(value).filter(key => !!value[key]);
        } else {
            console.error('ioneQueryName attribute must be an Array or String.');
        }
        this.buildRegExp();
        setTimeout(() => this.onChange(this._elementRef.nativeElement.value));
    }

    constructor(
        private _renderer: Renderer2,
        private _elementRef: ElementRef,
    ) {

    }

    ngOnInit(): void {
        this.inputText.pipe(
            takeUntil(this._ngUnsubscribe),
            debounceTime(100),
            distinctUntilChanged(),
        ).subscribe((value: any) => this.onChange(value));

        if (this._queryNames.length < 1 && this.name) {
            this._queryNames = [this.name];
        }
        this.buildRegExp();
    }

    writeValue(value: any): void {
        this.input(value);
    }

    input(value: any) {
        if (this._elementRef.nativeElement.tagName == 'INPUT') {
            this.inputText.next(value);
        } else if (this._elementRef.nativeElement.tagName == 'SELECT') {
            if (value == 'undefined') {
                this.inputText.next(undefined);
            } else {
                this.inputText.next(value);
            }
        }
    }

    isRsql(value: string): boolean {
        return this.regExp.test(value);
    }
    extractValueFromRsql(rsql: string): string {
        return this.regExp.exec(rsql)[1];
    }

    buildRegExp() {
        let regexStr = '^\\(';
        this._queryNames.forEach(querName => {
            switch (this._queryOperator) {
                case QueryOperator.EQUAL_TO:
                    regexStr += `${querName}==(.+?)${this._queryLogical}`;
                    break;
                case QueryOperator.NOT_EQUAL_TO:
                    regexStr += `${querName}!=(.+?)${this._queryLogical}`;
                    break;
                case QueryOperator.STARTS_WITH:
                    regexStr += `${querName}==(.+?)\\*${this._queryLogical}`;
                    break;
                case QueryOperator.ENDS_WITH:
                    regexStr += `${querName}==\\*(.+?)${this._queryLogical}`;
                    break;
                case QueryOperator.CONTAINS:
                    regexStr += `${querName}==\\*(.+?)\\*${this._queryLogical}`;
                    break;
                case QueryOperator.LESS_THAN:
                    regexStr += `${querName}<(.+?)${this._queryLogical}`;
                    break;
                case QueryOperator.LESS_THAN_OR_EQUAL_TO:
                    regexStr += `${querName}=le=(.+?)${this._queryLogical}`;
                    break;
                case QueryOperator.GREATER_THAN:
                    regexStr += `${querName}>(.+?)${this._queryLogical}`;
                    break;
                case QueryOperator.GREATER_THAN_OR_EQUAL_TO:
                    regexStr += `${querName}=ge=(.+?)${this._queryLogical}`;
                    break;
                case QueryOperator.IN:
                    regexStr += `${querName}=in=\\((.+?)\\)${this._queryLogical}`;
                    break;
                case QueryOperator.NOT_IN:
                    regexStr += `${querName}=out=\\((.+?)\\)${this._queryLogical}`;
                    break;
                default:
                    regexStr += `${querName}==(.+?)${this._queryLogical}`;
                    break;
            }
        });
        if (this._queryNames.length > 0) {
            regexStr = `${regexStr.slice(0, -1)}\\)$`;
        } else {
            regexStr = `${regexStr}\\)$`;
        }
        this.regExp = new RegExp(regexStr);
    }

    registerOnChange(fn: (_: any) => void): void {
        this.onChange = (value: any) => {
            if (this._queryNames.length < 1) {
                fn('');
                this._renderer.setProperty(this._elementRef.nativeElement, 'value', '');
                console.error('ioneQueryName attribute could not be null');
            } else if (this.isRsql(value)) {
                fn(value);
                this._renderer.setProperty(this._elementRef.nativeElement, 'value', this.extractValueFromRsql(value));
            } else if (value && this._queryNames.length) {
                let rsql = '(';
                this._queryNames.forEach(querName => {
                    switch (this._queryOperator) {
                        case QueryOperator.EQUAL_TO:
                            rsql += `${querName}==${value}${this._queryLogical}`;
                            break;
                        case QueryOperator.NOT_EQUAL_TO:
                            rsql += `${querName}!=${value}${this._queryLogical}`;
                            break;
                        case QueryOperator.STARTS_WITH:
                            rsql += `${querName}==${value}*${this._queryLogical}`;
                            break;
                        case QueryOperator.ENDS_WITH:
                            rsql += `${querName}==*${value}${this._queryLogical}`;
                            break;
                        case QueryOperator.CONTAINS:
                            rsql += `${querName}==*${value}*${this._queryLogical}`;
                            break;
                        case QueryOperator.LESS_THAN:
                            rsql += `${querName}<${value}${this._queryLogical}`;
                            break;
                        case QueryOperator.LESS_THAN_OR_EQUAL_TO:
                            rsql += `${querName}=le=${value}${this._queryLogical}`;
                            break;
                        case QueryOperator.GREATER_THAN:
                            rsql += `${querName}>${value}${this._queryLogical}`;
                            break;
                        case QueryOperator.GREATER_THAN_OR_EQUAL_TO:
                            rsql += `${querName}=ge=${value}${this._queryLogical}`;
                            break;
                        case QueryOperator.IN:
                            rsql += `${querName}=in=(${value})${this._queryLogical}`;
                            break;
                        case QueryOperator.NOT_IN:
                            rsql += `${querName}=out=(${value})${this._queryLogical}`;
                            break;
                        case QueryOperator.IN_RANGE:
                            const range = value.split(',');
                            rsql += `${querName}=ge=${range[0]};${querName}=le=${range[1]}${this._queryLogical}`;
                            break;
                        default:
                            rsql += `${querName}==${value}${this._queryLogical}`;
                            break;
                    }
                });
                rsql = `${rsql.slice(0, -1)})`;
                fn(rsql);
                this._renderer.setProperty(this._elementRef.nativeElement, 'value', value);
            } else {
                if (this._elementRef.nativeElement.tagName == 'INPUT') {
                    fn('');
                    this._renderer.setValue(this._elementRef.nativeElement, '');
                } else if (this._elementRef.nativeElement.tagName == 'SELECT') {
                    fn(undefined);
                    this._renderer.setProperty(this._elementRef.nativeElement, 'value', undefined);
                }
            }
        };
    }
    registerOnTouched(fn: () => void): void { this.onTouched = fn; }

    ngOnDestroy(): void {
        this._ngUnsubscribe.next();
        this._ngUnsubscribe.complete();
    }

}
