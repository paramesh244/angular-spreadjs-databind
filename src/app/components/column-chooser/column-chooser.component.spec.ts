import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColumnChooserComponent } from './column-chooser.component';
import { ColumnDefinition } from '../../models/post.model';

describe('ColumnChooserComponent', () => {
    let component: ColumnChooserComponent;
    let fixture: ComponentFixture<ColumnChooserComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ColumnChooserComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(ColumnChooserComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should calculate allSelected correctly', () => {
        component.columns = [
            { name: 'col1', displayName: 'Column 1', visible: true },
            { name: 'col2', displayName: 'Column 2', visible: true }
        ];
        expect(component.allSelected).toBe(true);

        component.columns[0].visible = false;
        expect(component.allSelected).toBe(false);
    });

    it('should calculate selectedCount correctly', () => {
        component.columns = [
            { name: 'col1', displayName: 'Column 1', visible: true },
            { name: 'col2', displayName: 'Column 2', visible: false },
            { name: 'col3', displayName: 'Column 3', visible: true }
        ];
        expect(component.selectedCount).toBe(2);
    });

    it('should toggle individual column', () => {
        const column: ColumnDefinition = { name: 'col1', displayName: 'Column 1', visible: true };
        component.columns = [column];

        spyOn(component.columnToggled, 'emit');

        component.toggleColumn(column);

        expect(column.visible).toBe(false);
        expect(component.columnToggled.emit).toHaveBeenCalledWith({
            columnName: 'col1',
            visible: false
        });
    });

    it('should toggle all columns to selected when none are selected', () => {
        component.columns = [
            { name: 'col1', displayName: 'Column 1', visible: false },
            { name: 'col2', displayName: 'Column 2', visible: false }
        ];

        spyOn(component.columnToggled, 'emit');

        component.toggleAll();

        expect(component.columns[0].visible).toBe(true);
        expect(component.columns[1].visible).toBe(true);
        expect(component.columnToggled.emit).toHaveBeenCalledTimes(2);
    });

    it('should toggle all columns to deselected when all are selected', () => {
        component.columns = [
            { name: 'col1', displayName: 'Column 1', visible: true },
            { name: 'col2', displayName: 'Column 2', visible: true }
        ];

        spyOn(component.columnToggled, 'emit');

        component.toggleAll();

        expect(component.columns[0].visible).toBe(false);
        expect(component.columns[1].visible).toBe(false);
        expect(component.columnToggled.emit).toHaveBeenCalledTimes(2);
    });

    it('should emit close event', () => {
        spyOn(component.close, 'emit');
        component.closePanel();
        expect(component.close.emit).toHaveBeenCalled();
    });

    it('should close on backdrop click', () => {
        spyOn(component, 'closePanel');
        const event = new MouseEvent('click');
        Object.defineProperty(event, 'target', { value: event.currentTarget, writable: false });
        component.handleBackdropClick(event);
        expect(component.closePanel).toHaveBeenCalled();
    });

    it('should close on Escape key', () => {
        spyOn(component, 'closePanel');
        const event = new KeyboardEvent('keydown', { key: 'Escape' });
        component.handleKeyDown(event);
        expect(component.closePanel).toHaveBeenCalled();
    });
});
