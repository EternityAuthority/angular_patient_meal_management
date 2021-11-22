import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientFoodReviewComponent } from './client-food-review.component';

describe('ClientFoodReviewComponent', () => {
  let component: ClientFoodReviewComponent;
  let fixture: ComponentFixture<ClientFoodReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientFoodReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientFoodReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
