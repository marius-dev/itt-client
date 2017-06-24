import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationActivityListComponent } from './evaluation-activity-list.component';

describe('EvaluationActivityListComponent', () => {
  let component: EvaluationActivityListComponent;
  let fixture: ComponentFixture<EvaluationActivityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluationActivityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationActivityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
