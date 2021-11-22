import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientinfoComponent } from './clientinfo.component';

describe('ClientinfoComponent', () => {
  let component: ClientinfoComponent;
  let fixture: ComponentFixture<ClientinfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientinfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
