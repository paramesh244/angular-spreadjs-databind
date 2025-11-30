import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ColumnDefinition } from '../../models/post.model';

@Component({
    selector: 'app-column-chooser',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './column-chooser.component.html',
    styleUrls: ['./column-chooser.component.css']
})
export class ColumnChooserComponent {
    @Input() columns: ColumnDefinition[] = [];
    @Input() isOpen = false;

    @Output() close = new EventEmitter<void>();
    @Output() columnToggled = new EventEmitter<{ columnName: string; visible: boolean }>();

    get allSelected(): boolean {
        return this.columns.length > 0 && this.columns.every(col => col.visible);
    }

    get selectedCount(): number {
        return this.columns.filter(col => col.visible).length;
    }

    toggleColumn(column: ColumnDefinition): void {
        column.visible = !column.visible;
        this.columnToggled.emit({ columnName: column.name, visible: column.visible });
    }

    toggleAll(): void {
        const newState = !this.allSelected;
        this.columns.forEach(col => {
            col.visible = newState;
            this.columnToggled.emit({ columnName: col.name, visible: newState });
        });
    }

    closePanel(): void {
        this.close.emit();
    }

    handleBackdropClick(event: MouseEvent): void {
        if (event.target === event.currentTarget) {
            this.closePanel();
        }
    }

    handleKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            this.closePanel();
        }
    }
}
