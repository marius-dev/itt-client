import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachingActivityComponent } from './teaching-activity.component';

describe('TeachingActivityComponent', () => {
  let component: TeachingActivityComponent;
  let fixture: ComponentFixture<TeachingActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeachingActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeachingActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
