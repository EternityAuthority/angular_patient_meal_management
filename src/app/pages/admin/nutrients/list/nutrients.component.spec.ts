import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NutrientsComponent } from './nutrients.component';

describe('NutrientsComponent', () => {
  let component: NutrientsComponent;
  let fixture: ComponentFixture<NutrientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NutrientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NutrientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
