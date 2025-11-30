import {
    Component,
    ElementRef,
    ViewChild,
    AfterViewInit,
    OnDestroy,
    Input,
    Output,
    EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post, ColumnDefinition } from '../../models/post.model';

declare const GC: any;

@Component({
    selector: 'app-spreadsheet',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './spreadsheet.component.html',
    styleUrls: ['./spreadsheet.component.css']
})
export class SpreadsheetComponent implements AfterViewInit, OnDestroy {
    @ViewChild('spreadContainer', { static: false }) spreadContainer!: ElementRef;

    @Input() posts: Post[] = [];
    @Input() loading = false;
    @Input() error: string | null = null;

    @Output() dataLoaded = new EventEmitter<void>();

    private workbook: any;
    private sheet: any;

    columns: ColumnDefinition[] = [
        { name: 'userId', displayName: 'User ID', visible: true },
        { name: 'id', displayName: 'ID', visible: true },
        { name: 'title', displayName: 'Title', visible: true },
        { name: 'body', displayName: 'Body', visible: true }
    ];

    ngAfterViewInit(): void {
        this.initializeSpreadJS();
    }

    ngOnDestroy(): void {
        if (this.workbook) {
            this.workbook.destroy();
        }
    }

    private initializeSpreadJS(): void {
        if (typeof GC === 'undefined' || !GC.Spread) {
            console.error('SpreadJS library not loaded');
            return;
        }


        this.workbook = new GC.Spread.Sheets.Workbook(this.spreadContainer.nativeElement, {
            sheetCount: 1
        });

        this.sheet = this.workbook.getActiveSheet();
        this.sheet.name('Posts Data');


        this.configureSheet();

        if (this.posts.length > 0) {
            this.loadData();
        }
    }

    private configureSheet(): void {
        this.columns.forEach((col, index) => {
            this.sheet.setValue(0, index, col.displayName, GC.Spread.Sheets.SheetArea.colHeader);

            if (col.name === 'userId') {
                this.sheet.setColumnWidth(index, 80);
            } else if (col.name === 'id') {
                this.sheet.setColumnWidth(index, 60);
            } else if (col.name === 'title') {
                this.sheet.setColumnWidth(index, 400);
                const style = new GC.Spread.Sheets.Style();
                style.wordWrap = true;
                style.vAlign = GC.Spread.Sheets.VerticalAlign.top;
                this.sheet.setStyle(-1, index, style);
            } else if (col.name === 'body') {
                this.sheet.setColumnWidth(index, 500);
                const style = new GC.Spread.Sheets.Style();
                style.wordWrap = true;
                style.vAlign = GC.Spread.Sheets.VerticalAlign.top;
                this.sheet.setStyle(-1, index, style);
            }
        });


        this.sheet.defaults.rowHeight = 60;

        this.sheet.options.rowHeaderVisible = true;
        this.sheet.options.colHeaderVisible = true;


        this.sheet.frozenRowCount(1);

        this.sheet.options.isProtected = false;

        this.sheet.options.autoFitType = GC.Spread.Sheets.AutoFitType.cellWithHeader;
    }

    loadData(): void {
        if (!this.sheet || this.posts.length === 0) return;

      
        const rowCount = this.sheet.getRowCount();
        if (rowCount > 0) {
            this.sheet.clear(0, 0, rowCount, this.columns.length, GC.Spread.Sheets.SheetArea.viewport);
        }

    
        const dataSource = this.posts.map(post => ({
            userId: post.userId,
            id: post.id,
            title: post.title,
            body: post.body
        }));


        this.sheet.setDataSource(dataSource);

        this.applyColumnVisibility();

        this.dataLoaded.emit();
    }

    setColumnVisible(columnName: string, visible: boolean): void {
        const columnIndex = this.columns.findIndex(col => col.name === columnName);
        if (columnIndex !== -1) {
            this.columns[columnIndex].visible = visible;
            this.sheet.setColumnVisible(columnIndex, visible);
        }
    }

    private applyColumnVisibility(): void {
        this.columns.forEach((col, index) => {
            this.sheet.setColumnVisible(index, col.visible);
        });
    }

    getRowData(rowIndex: number): Record<string, any> {
        const rowData: Record<string, any> = {};

        this.columns.forEach((col, colIndex) => {
            if (col.visible) {
                const value = this.sheet.getValue(rowIndex, colIndex);
                rowData[col.name] = value;
            }
        });

        return rowData;
    }

    getAllVisibleRows(selectedColumns?: string[]): Record<string, any>[] {
        const rowCount = this.sheet.getRowCount();
        const rows: Record<string, any>[] = [];

        for (let i = 0; i < rowCount; i++) {
            const rowData: Record<string, any> = {};
            let hasData = false;

            this.columns.forEach((col, colIndex) => {
                const value = this.sheet.getValue(i, colIndex);

                const shouldInclude = selectedColumns
                    ? selectedColumns.includes(col.name)
                    : true;

                if (shouldInclude && value !== null && value !== undefined) {
                    rowData[col.name] = value;
                    hasData = true;
                }
            });

            
            if (hasData) {
                rows.push(rowData);
            }
        }

        return rows;
    }

    getAllRows(): Post[] {
        const rowCount = this.sheet.getRowCount();
        const rows: Post[] = [];

        for (let i = 0; i < rowCount; i++) {
            const userId = this.sheet.getValue(i, 0);
            const id = this.sheet.getValue(i, 1);
            const title = this.sheet.getValue(i, 2);
            const body = this.sheet.getValue(i, 3);

  
            if (id !== null && id !== undefined) {
                rows.push({ userId, id, title, body });
            }
        }

        return rows;
    }

    getVisibleColumns(): ColumnDefinition[] {
        return this.columns.filter(col => col.visible);
    }

    getAllColumns(): ColumnDefinition[] {
        return this.columns;
    }
}
