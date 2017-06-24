import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityLoadComponent } from './activity-load.component';

describe('ActivityLoadComponent', () => {
  let component: ActivityLoadComponent;
  let fixture: ComponentFixture<ActivityLoadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityLoadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
