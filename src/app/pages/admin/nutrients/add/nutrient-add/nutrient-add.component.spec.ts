import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NutrientAddComponent } from './nutrient-add.component';

describe('NutrientAddComponent', () => {
  let component: NutrientAddComponent;
  let fixture: ComponentFixture<NutrientAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NutrientAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NutrientAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
