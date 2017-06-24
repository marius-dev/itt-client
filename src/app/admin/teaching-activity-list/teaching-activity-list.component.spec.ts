import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachingActivityListComponent } from './teaching-activity-list.component';

describe('TeachingActivityListComponent', () => {
  let component: TeachingActivityListComponent;
  let fixture: ComponentFixture<TeachingActivityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeachingActivityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeachingActivityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
