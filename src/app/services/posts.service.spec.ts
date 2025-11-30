import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PostsService } from './posts.service';
import { Post } from '../models/post.model';

describe('PostsService', () => {
    let service: PostsService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [PostsService]
        });
        service = TestBed.inject(PostsService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should fetch posts successfully', () => {
        const mockPosts: Post[] = [
            { userId: 1, id: 1, title: 'Test Post 1', body: 'Body 1' },
            { userId: 1, id: 2, title: 'Test Post 2', body: 'Body 2' }
        ];

        service.getPosts().subscribe(posts => {
            expect(posts.length).toBe(2);
            expect(posts).toEqual(mockPosts);
        });

        const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/posts');
        expect(req.request.method).toBe('GET');
        req.flush(mockPosts);
    });

    it('should handle error when fetching posts fails', () => {
        service.getPosts().subscribe({
            next: () => fail('should have failed'),
            error: (error) => {
                expect(error).toBeTruthy();
                expect(error.message).toContain('Server returned code 500');
            }
        });

        const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/posts');
        req.flush('Error', { status: 500, statusText: 'Server Error' });
    });

    it('should retry failed requests', () => {
        const mockPosts: Post[] = [
            { userId: 1, id: 1, title: 'Test Post', body: 'Body' }
        ];

        service.getPosts().subscribe(posts => {
            expect(posts).toEqual(mockPosts);
        });

        // First request fails
        const req1 = httpMock.expectOne('https://jsonplaceholder.typicode.com/posts');
        req1.flush('Error', { status: 500, statusText: 'Server Error' });

        // Second request (retry) succeeds
        const req2 = httpMock.expectOne('https://jsonplaceholder.typicode.com/posts');
        req2.flush(mockPosts);
    });
});
