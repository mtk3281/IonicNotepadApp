import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateNewNotePage } from './create-new-note.page';

describe('CreateNewNotePage', () => {
  let component: CreateNewNotePage;
  let fixture: ComponentFixture<CreateNewNotePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewNotePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
