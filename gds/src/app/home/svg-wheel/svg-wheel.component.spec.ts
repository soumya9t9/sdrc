import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgWheelComponent } from './svg-wheel.component';

describe('SvgWheelComponent', () => {
  let component: SvgWheelComponent;
  let fixture: ComponentFixture<SvgWheelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SvgWheelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgWheelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
