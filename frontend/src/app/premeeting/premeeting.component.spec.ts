import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremeetingComponent } from './premeeting.component';

describe('PremeetingComponent', () => {
  let component: PremeetingComponent;
  let fixture: ComponentFixture<PremeetingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremeetingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
