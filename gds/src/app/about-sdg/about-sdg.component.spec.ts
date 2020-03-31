import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutSdgComponent } from './about-sdg.component';

describe('AboutSdgComponent', () => {
  let component: AboutSdgComponent;
  let fixture: ComponentFixture<AboutSdgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutSdgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutSdgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
