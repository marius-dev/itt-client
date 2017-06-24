import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationActivityComponent } from './evaluation-activity.component';

describe('EvaluationActivityComponent', () => {
  let component: EvaluationActivityComponent;
  let fixture: ComponentFixture<EvaluationActivityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluationActivityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
