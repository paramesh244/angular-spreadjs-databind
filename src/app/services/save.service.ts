import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { SavePayload, SaveAllPayload, SaveResponse } from '../models/post.model';

@Injectable({
    providedIn: 'root'
})
export class SaveService {
    private readonly BASE_URL = 'http://localhost:3000/api';
    private readonly TIMEOUT_MS = 10000; // 10 seconds

    constructor(private http: HttpClient) { }

    saveColumns(payload: SavePayload): Observable<SaveResponse> {
        return this.http.post<SaveResponse>(`${this.BASE_URL}/save-columns`, payload).pipe(
            timeout(this.TIMEOUT_MS),
            catchError(this.handleError)
        );
    }

    saveAll(payload: SaveAllPayload): Observable<SaveResponse> {
        return this.http.post<SaveResponse>(`${this.BASE_URL}/save-all`, payload).pipe(
            timeout(this.TIMEOUT_MS),
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse | any): Observable<never> {
        let errorMessage = 'An error occurred while saving data.';

        if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = `Error: ${error.error.message}`;
        } else if (error.name && error.name === 'TimeoutError') {
            errorMessage = 'Request timed out. Please try again.';
        } else if (error.status === 0) {
            errorMessage = 'Cannot connect to server. Please ensure the backend is running.';
        } else {
            // Server-side error
            errorMessage = `Server returned code ${error.status}: ${error.message}`;
        }

        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}
