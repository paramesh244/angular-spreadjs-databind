import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { PostsService } from './services/posts.service';
import { SaveService } from './services/save.service';
import { of, throwError } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let postsService: jasmine.SpyObj<PostsService>;
  let saveService: jasmine.SpyObj<SaveService>;

  beforeEach(async () => {
    const postsServiceSpy = jasmine.createSpyObj('PostsService', ['getPosts']);
    const saveServiceSpy = jasmine.createSpyObj('SaveService', ['saveColumns', 'saveAll']);

    await TestBed.configureTestingModule({
      imports: [AppComponent, HttpClientTestingModule],
      providers: [
        { provide: PostsService, useValue: postsServiceSpy },
        { provide: SaveService, useValue: saveServiceSpy }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    postsService = TestBed.inject(PostsService) as jasmine.SpyObj<PostsService>;
    saveService = TestBed.inject(SaveService) as jasmine.SpyObj<SaveService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load posts on init', () => {
    const mockPosts = [
      { userId: 1, id: 1, title: 'Post 1', body: 'Body 1' },
      { userId: 1, id: 2, title: 'Post 2', body: 'Body 2' }
    ];

    postsService.getPosts.and.returnValue(of(mockPosts));

    component.ngOnInit();

    expect(postsService.getPosts).toHaveBeenCalled();
    expect(component.posts).toEqual(mockPosts);
    expect(component.loading).toBe(false);
  });

  it('should handle error when loading posts fails', () => {
    const error = new Error('Failed to load');
    postsService.getPosts.and.returnValue(throwError(() => error));

    component.ngOnInit();

    expect(component.error).toBe('Failed to load');
    expect(component.loading).toBe(false);
  });

  it('should add toast notification', () => {
    component['addToast']('success', 'Test message');

    expect(component.toasts.length).toBe(1);
    expect(component.toasts[0].type).toBe('success');
    expect(component.toasts[0].message).toBe('Test message');
  });

  it('should export JSON file', () => {
    spyOn(document, 'createElement').and.returnValue({
      click: jasmine.createSpy('click'),
      href: '',
      download: ''
    } as any);

    component.exportJSON();

    expect(document.createElement).toHaveBeenCalledWith('a');
  });

  it('should open and close column chooser', () => {
    expect(component.columnChooserOpen).toBe(false);

    component.openColumnChooser();
    expect(component.columnChooserOpen).toBe(true);

    component.closeColumnChooser();
    expect(component.columnChooserOpen).toBe(false);
  });

  it('should open and close preview modal', () => {
    expect(component.previewModalOpen).toBe(false);

    component.previewSelectedColumns();
    expect(component.previewModalOpen).toBe(true);

    component.closePreviewModal();
    expect(component.previewModalOpen).toBe(false);
  });
});
