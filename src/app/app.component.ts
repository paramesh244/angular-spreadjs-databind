import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SpreadsheetComponent } from './components/spreadsheet/spreadsheet.component';
import { ColumnChooserComponent } from './components/column-chooser/column-chooser.component';
import { PreviewModalComponent } from './components/preview-modal/preview-modal.component';
import { ToastComponent, Toast } from './components/toast/toast.component';
import { PostsService } from './services/posts.service';
import { SaveService } from './services/save.service';
import { Post, SavePayload, SaveAllPayload } from './models/post.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    SpreadsheetComponent,
    ColumnChooserComponent,
    PreviewModalComponent,
    ToastComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild(SpreadsheetComponent) spreadsheet!: SpreadsheetComponent;

  posts: Post[] = [];
  loading = false;
  error: string | null = null;

  columnChooserOpen = false;
  previewModalOpen = false;
  previewPayload: any = null;

  toasts: Toast[] = [];
  private toastIdCounter = 0;

  savingColumns = false;
  savingAll = false;

  constructor(
    private postsService: PostsService,
    private saveService: SaveService
  ) { }

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading = true;
    this.error = null;

    this.postsService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
        this.loading = false;
        this.addToast('success', `Loaded ${posts.length} posts successfully`);
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
        this.addToast('error', 'Failed to load posts. Please try again.');
      }
    });
  }

  openColumnChooser(): void {
    this.columnChooserOpen = true;
  }

  closeColumnChooser(): void {
    this.columnChooserOpen = false;
  }

  handleColumnToggled(event: { columnName: string; visible: boolean }): void {
    if (this.spreadsheet) {
      this.spreadsheet.setColumnVisible(event.columnName, event.visible);
    }
  }

  get selectedColumns(): string[] {
    if (!this.spreadsheet || !this.spreadsheet.columns) return [];
    return this.spreadsheet.columns.filter(col => col.visible).map(col => col.name);
  }

  get canSaveColumns(): boolean {
    return this.selectedColumns.length > 0 && !this.savingColumns && this.posts.length > 0;
  }

  get canSaveAll(): boolean {
    return !this.savingAll && this.posts.length > 0;
  }

  saveSelectedColumns(): void {
    if (!this.canSaveColumns || !this.spreadsheet) return;

    const selectedCols = this.selectedColumns;
    const rows = this.spreadsheet.getAllVisibleRows(selectedCols);

    if (rows.length === 0) {
      this.addToast('error', 'No data to save');
      return;
    }

    const payload: SavePayload = {
      selectedColumns: selectedCols,
      rows: rows
    };

    this.savingColumns = true;

    this.saveService.saveColumns(payload).subscribe({
      next: (response) => {
        this.savingColumns = false;
        this.addToast('success', `Saved ${response.savedCount} rows with ${selectedCols.length} columns`);
      },
      error: (err) => {
        this.savingColumns = false;
        this.addToast('error', err.message);
      }
    });
  }

  saveAllData(): void {
    if (!this.canSaveAll || !this.spreadsheet) return;

    const rows = this.spreadsheet.getAllRows();

    if (rows.length === 0) {
      this.addToast('error', 'No data to save');
      return;
    }

    const payload: SaveAllPayload = {
      rows: rows
    };

    this.savingAll = true;

    this.saveService.saveAll(payload).subscribe({
      next: (response) => {
        this.savingAll = false;
        this.addToast('success', `Saved all data: ${response.savedCount} rows`);
      },
      error: (err) => {
        this.savingAll = false;
        this.addToast('error', err.message);
      }
    });
  }

  previewSelectedColumns(): void {
    if (!this.spreadsheet) return;

    const selectedCols = this.selectedColumns;
    const rows = this.spreadsheet.getAllVisibleRows(selectedCols);

    this.previewPayload = {
      selectedColumns: selectedCols,
      rows: rows.slice(0, 5) 
    };

    this.previewModalOpen = true;
  }

  exportJSON(): void {
    if (!this.spreadsheet) return;

    const selectedCols = this.selectedColumns;
    const rows = this.spreadsheet.getAllVisibleRows(selectedCols);

    const payload = {
      selectedColumns: selectedCols,
      rows: rows
    };

    const dataStr = JSON.stringify(payload, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `posts-export-${Date.now()}.json`;
    link.click();

    URL.revokeObjectURL(url);
    this.addToast('success', 'JSON file downloaded');
  }

  closePreviewModal(): void {
    this.previewModalOpen = false;
  }

  private addToast(type: 'success' | 'error' | 'info', message: string): void {
    const toast: Toast = {
      id: this.toastIdCounter++,
      type,
      message
    };

    this.toasts.push(toast);

    setTimeout(() => {
      const index = this.toasts.findIndex(t => t.id === toast.id);
      if (index !== -1) {
        this.toasts.splice(index, 1);
      }
    }, 5000);
  }
}
