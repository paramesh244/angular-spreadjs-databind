import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Post } from '../models/post.model';

@Injectable({
    providedIn: 'root'
})
export class PostsService {
    private readonly API_URL = 'https://jsonplaceholder.typicode.com/posts';

    constructor(private http: HttpClient) { }

    getPosts(): Observable<Post[]> {
        return this.http.get<Post[]>(this.API_URL).pipe(
            retry(2), 
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = 'An error occurred while fetching posts.';

        if (error.error instanceof ErrorEvent) {
        
            errorMessage = `Error: ${error.error.message}`;
        } else {
            errorMessage = `Server returned code ${error.status}: ${error.message}`;
        }

        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}
