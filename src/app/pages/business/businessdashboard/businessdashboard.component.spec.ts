import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessdashboardComponent } from './businessdashboard.component';

describe('BusinessdashboardComponent', () => {
  let component: BusinessdashboardComponent;
  let fixture: ComponentFixture<BusinessdashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessdashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
