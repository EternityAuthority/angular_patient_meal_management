import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxauthenticateComponent } from './ngxauthenticate.component';

describe('NgxauthenticateComponent', () => {
  let component: NgxauthenticateComponent;
  let fixture: ComponentFixture<NgxauthenticateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxauthenticateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxauthenticateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
