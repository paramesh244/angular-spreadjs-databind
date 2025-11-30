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

        // Initialize workbook
        this.workbook = new GC.Spread.Sheets.Workbook(this.spreadContainer.nativeElement, {
            sheetCount: 1
        });

        this.sheet = this.workbook.getActiveSheet();
        this.sheet.name('Posts Data');

        // Configure sheet
        this.configureSheet();

        // Load data if available
        if (this.posts.length > 0) {
            this.loadData();
        }
    }

    private configureSheet(): void {
        // Set column headers and configure each column
        this.columns.forEach((col, index) => {
            this.sheet.setValue(0, index, col.displayName, GC.Spread.Sheets.SheetArea.colHeader);

            // Set column width based on content
            if (col.name === 'userId') {
                this.sheet.setColumnWidth(index, 80);
            } else if (col.name === 'id') {
                this.sheet.setColumnWidth(index, 60);
            } else if (col.name === 'title') {
                this.sheet.setColumnWidth(index, 400);
                // Enable text wrapping for title column
                const style = new GC.Spread.Sheets.Style();
                style.wordWrap = true;
                style.vAlign = GC.Spread.Sheets.VerticalAlign.top;
                this.sheet.setStyle(-1, index, style);
            } else if (col.name === 'body') {
                this.sheet.setColumnWidth(index, 500);
                // Enable text wrapping for body column
                const style = new GC.Spread.Sheets.Style();
                style.wordWrap = true;
                style.vAlign = GC.Spread.Sheets.VerticalAlign.top;
                this.sheet.setStyle(-1, index, style);
            }
        });

        // Set default row height to accommodate wrapped text
        this.sheet.defaults.rowHeight = 60;

        // Enable virtualization for performance with large datasets
        this.sheet.options.rowHeaderVisible = true;
        this.sheet.options.colHeaderVisible = true;

        // Freeze the header row
        this.sheet.frozenRowCount(1);

        // Allow editing
        this.sheet.options.isProtected = false;

        // Enable automatic row height adjustment
        this.sheet.options.autoFitType = GC.Spread.Sheets.AutoFitType.cellWithHeader;
    }

    loadData(): void {
        if (!this.sheet || this.posts.length === 0) return;

        // Clear existing data using the correct SpreadJS method
        const rowCount = this.sheet.getRowCount();
        if (rowCount > 0) {
            this.sheet.clear(0, 0, rowCount, this.columns.length, GC.Spread.Sheets.SheetArea.viewport);
        }

        // Set data source
        const dataSource = this.posts.map(post => ({
            userId: post.userId,
            id: post.id,
            title: post.title,
            body: post.body
        }));

        // Bind data to sheet
        this.sheet.setDataSource(dataSource);

        // Apply column visibility
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

                // Check if we should include this column
                const shouldInclude = selectedColumns
                    ? selectedColumns.includes(col.name)
                    : true;

                if (shouldInclude && value !== null && value !== undefined) {
                    rowData[col.name] = value;
                    hasData = true;
                }
            });

            // Only add rows that have data
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

            // Only add rows that have data
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
