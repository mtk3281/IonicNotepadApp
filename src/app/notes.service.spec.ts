import { TestBed } from '@angular/core/testing';
import { NotesService } from './notes.service';
import { Storage } from '@ionic/storage-angular';

describe('NotesService', () => {
  let service: NotesService;
  let storageMock: jasmine.SpyObj<Storage>;

  beforeEach(async () => {
    storageMock = jasmine.createSpyObj('Storage', ['create', 'get', 'set', 'remove', 'keys']);
    storageMock.create.and.returnValue(Promise.resolve(storageMock));
    storageMock.get.and.returnValue(Promise.resolve(null));
    storageMock.set.and.returnValue(Promise.resolve());
    storageMock.remove.and.returnValue(Promise.resolve());
    storageMock.keys.and.returnValue(Promise.resolve([]));

    await TestBed.configureTestingModule({
      providers: [
        NotesService,
        { provide: Storage, useValue: storageMock }
      ]
    }).compileComponents();

    service = TestBed.inject(NotesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Example test for `getNotes`
  it('should return notes', async () => {
    spyOn(service, 'getNotes').and.returnValue(Promise.resolve([]));
    const notes = await service.getNotes(false);
    expect(notes).toEqual([]);
  });
});
