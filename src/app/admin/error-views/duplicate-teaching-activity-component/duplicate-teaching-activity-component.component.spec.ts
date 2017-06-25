import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateTeachingActivityComponent } from './duplicate-teaching-activity-component.component';

describe('DuplicateTeachingActivityComponent', () => {
  let component: DuplicateTeachingActivityComponent;
  let fixture: ComponentFixture<DuplicateTeachingActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DuplicateTeachingActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicateTeachingActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
