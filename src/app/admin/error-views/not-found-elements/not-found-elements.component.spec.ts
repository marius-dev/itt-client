import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotFoundElementsComponent } from './not-found-elements.component';

describe('NotFoundElementsComponent', () => {
  let component: NotFoundElementsComponent;
  let fixture: ComponentFixture<NotFoundElementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotFoundElementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotFoundElementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
