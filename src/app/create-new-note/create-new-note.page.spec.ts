import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateNewNotePage } from './create-new-note.page';
import { IonicModule, PopoverController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

describe('CreateNewNotePage', () => {
  let component: CreateNewNotePage;
  let fixture: ComponentFixture<CreateNewNotePage>;
  let storageMock: jasmine.SpyObj<Storage>;
  let popoverControllerMock: jasmine.SpyObj<PopoverController>;

  beforeEach(async () => {
    // Create the spy object for Storage with the 'create' method
    storageMock = jasmine.createSpyObj('Storage', ['create', 'get', 'set', 'remove']);
    // Initialize 'create' to resolve to a promise (if it needs to be async)
    storageMock.create.and.returnValue(Promise.resolve() as unknown as Promise<Storage>);

    // Create the spy object for PopoverController
    popoverControllerMock = jasmine.createSpyObj('PopoverController', ['create']);

    await TestBed.configureTestingModule({
      declarations: [CreateNewNotePage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: Storage, useValue: storageMock },
        { provide: PopoverController, useValue: popoverControllerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateNewNotePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
