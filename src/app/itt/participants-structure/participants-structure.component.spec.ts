import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantsStructureComponent } from './participants-structure.component';

describe('ParticipantsStructureComponent', () => {
  let component: ParticipantsStructureComponent;
  let fixture: ComponentFixture<ParticipantsStructureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipantsStructureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantsStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
