import { Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2 } from '@angular/core';
@Directive({
    selector: 'div[ioneSortResult],div[ioneSortName]',
})
export class SortObjectAccessorDirective implements OnInit {

    private _sortNumElement = this._renderer.createElement('span');
    private _iconElement = this._renderer.createElement('i');

    @Input('ioneSortName') sortName: string;
    private sortResults: any[];
    @Input('ioneSortResult') set ioneSortResult(array: any[]) {
        this.sortResults = array;
        const input = this.sortResults.find(sort => sort.name == this.sortName);
        if (input) {
            this.sortType = input.type;
        } else {
            this.sortType = null;
        }
        this.renderView();
    }
    @Output('ioneSortResultChange') sortResultChange = new EventEmitter<any[]>();
    sortType: 'desc' | 'asc';

    constructor(
        private _renderer: Renderer2,
        private _elementRef: ElementRef, ) {

    }

    ngOnInit(): void {
        this._renderer.setStyle(this._elementRef.nativeElement, 'cursor', 'pointer');
        this._renderer.appendChild(this._elementRef.nativeElement, this._sortNumElement);
        this._renderer.appendChild(this._elementRef.nativeElement, this._iconElement);
        this._renderer.addClass(this._sortNumElement, 'ml-2');
    }

    @HostListener('click', ['$event'])
    onClick(event) {
        if (this.sortType == 'asc') {
            this.sortType = 'desc';
            this.sortResults = this.sortResults.filter(v => v.name != this.sortName)
                .concat([{
                    name: this.sortName,
                    type: this.sortType
                }]);
        } else if (this.sortType == 'desc') {
            this.sortType = null;
            this.sortResults = this.sortResults.filter(v => v.name != this.sortName);
        } else {
            this.sortType = 'asc';
            this.sortResults = this.sortResults.concat([{
                name: this.sortName,
                type: this.sortType
            }]);
        }
        this.renderView();
        this.sortResultChange.emit(this.sortResults);
    }
    renderView() {
        const index = this.sortResults.map(v => v.name).indexOf(this.sortName) + 1;
        if (this.sortType == 'desc') {
            this._renderer.setProperty(this._sortNumElement, 'innerHTML', String(index));
            this._renderer.setAttribute(this._iconElement, 'class', 'fa fa-long-arrow-down');
        } else if (this.sortType == 'asc') {
            this._renderer.setProperty(this._sortNumElement, 'innerHTML', String(index));
            this._renderer.setAttribute(this._iconElement, 'class', 'fa fa-long-arrow-up');
        } else {
            this._renderer.setProperty(this._sortNumElement, 'innerHTML', '');
            this._renderer.setAttribute(this._iconElement, 'class', '');
        }
    }
}
