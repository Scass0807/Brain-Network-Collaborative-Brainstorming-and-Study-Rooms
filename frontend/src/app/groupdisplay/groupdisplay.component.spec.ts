import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupdisplayComponent } from './groupdisplay.component';

describe('GroupdisplayComponent', () => {
  let component: GroupdisplayComponent;
  let fixture: ComponentFixture<GroupdisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupdisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupdisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
