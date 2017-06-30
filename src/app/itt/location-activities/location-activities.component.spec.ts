import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationActivitiesComponent } from './location-activities.component';

describe('LocationActivitiesComponent', () => {
  let component: LocationActivitiesComponent;
  let fixture: ComponentFixture<LocationActivitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationActivitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
