import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsPage } from './settings.page';
import { IonicModule } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular'; 

describe('SettingsPage', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;
  let storageMock: jasmine.SpyObj<Storage>;

  beforeEach(async () => {
    storageMock = jasmine.createSpyObj('Storage', ['create', 'get', 'set', 'remove']);

    await TestBed.configureTestingModule({
      declarations: [SettingsPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: Storage, useValue: storageMock } 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
