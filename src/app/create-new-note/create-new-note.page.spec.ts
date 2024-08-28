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
    storageMock = jasmine.createSpyObj('Storage', ['create', 'get', 'set', 'remove']);
    storageMock.create.and.returnValue(Promise.resolve() as unknown as Promise<Storage>);
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
