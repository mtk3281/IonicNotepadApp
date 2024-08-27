import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotesPage } from './notes.page';
import { NotesService } from '../notes.service';
import { Router } from '@angular/router';
import { AlertController, ToastController, IonicModule } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

// Spy Object Definitions
const notesServiceSpy = jasmine.createSpyObj('NotesService', ['getNotes', 'deleteNoteById', 'updateNote']);
const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
const alertControllerSpy = jasmine.createSpyObj('AlertController', ['create']);
const toastControllerSpy = jasmine.createSpyObj('ToastController', ['create']);

describe('NotesPage', () => {
  let component: NotesPage;
  let fixture: ComponentFixture<NotesPage>;

  beforeEach(async () => {
    // Configure spies
    alertControllerSpy.create.and.returnValue(Promise.resolve({
      present: () => Promise.resolve(),
      onDidDismiss: () => Promise.resolve()
    } as any));
    toastControllerSpy.create.and.returnValue(Promise.resolve({
      present: () => Promise.resolve()
    } as any));

    // Configure TestBed
    await TestBed.configureTestingModule({
      declarations: [NotesPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: NotesService, useValue: notesServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: AlertController, useValue: alertControllerSpy },
        { provide: ToastController, useValue: toastControllerSpy },
        { provide: Storage, useValue: { create: () => Promise.resolve() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NotesPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load notes on initialization', async () => {
    const mockNotes = [{ id: '1', title: 'Test Note', content: 'Content', date: '2024-08-27' }];
    notesServiceSpy.getNotes.and.returnValue(Promise.resolve(mockNotes));
    
    await component.ngOnInit(); // Call ngOnInit manually

    expect(component.notes).toEqual(mockNotes);
  });

  it('should call loadNotes on init', async () => {
    const mockNotes = [{ id: '1', title: 'Test Note', content: 'Content', date: '2024-08-27' }];
    notesServiceSpy.getNotes.and.returnValue(Promise.resolve(mockNotes));
    
    spyOn(component, 'loadNotes').and.callThrough(); // Spy on loadNotes method

    await component.ngOnInit(); // Call ngOnInit manually

    expect(component.loadNotes).toHaveBeenCalled(); // Check if loadNotes was called
  });

  // Add more tests as needed
});
