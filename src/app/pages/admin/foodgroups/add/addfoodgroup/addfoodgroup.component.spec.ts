import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddfoodgroupComponent } from './addfoodgroup.component';

describe('AddfoodgroupComponent', () => {
  let component: AddfoodgroupComponent;
  let fixture: ComponentFixture<AddfoodgroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddfoodgroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddfoodgroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
