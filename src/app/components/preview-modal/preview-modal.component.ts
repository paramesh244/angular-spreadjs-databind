import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-preview-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './preview-modal.component.html',
    styleUrls: ['./preview-modal.component.css']
})
export class PreviewModalComponent {
    @Input() isOpen = false;
    @Input() payload: any = null;

    @Output() close = new EventEmitter<void>();

    copied = false;

    get formattedPayload(): string {
        return JSON.stringify(this.payload, null, 2);
    }

    closeModal(): void {
        this.close.emit();
    }

    handleBackdropClick(event: MouseEvent): void {
        if (event.target === event.currentTarget) {
            this.closeModal();
        }
    }

    handleKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            this.closeModal();
        }
    }

    async copyToClipboard(): Promise<void> {
        try {
            await navigator.clipboard.writeText(this.formattedPayload);
            this.copied = true;
            setTimeout(() => {
                this.copied = false;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }
}
