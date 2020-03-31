import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashedBarchartComponent } from './dashed-barchart.component';

describe('DashedBarchartComponent', () => {
  let component: DashedBarchartComponent;
  let fixture: ComponentFixture<DashedBarchartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashedBarchartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashedBarchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
