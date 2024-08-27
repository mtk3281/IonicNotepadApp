import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarPage } from './calendar.page';
import { IonicModule } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';  

describe('CalendarPage', () => {
  let component: CalendarPage;
  let fixture: ComponentFixture<CalendarPage>;
  let storageMock: jasmine.SpyObj<Storage>;

  beforeEach(async () => {
    storageMock = jasmine.createSpyObj('Storage', ['get', 'set', 'remove']); 

    await TestBed.configureTestingModule({
      declarations: [CalendarPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: Storage, useValue: storageMock }  
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
