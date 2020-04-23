import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheboardComponent } from './theboard.component';

describe('TheboardComponent', () => {
  let component: TheboardComponent;
  let fixture: ComponentFixture<TheboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
