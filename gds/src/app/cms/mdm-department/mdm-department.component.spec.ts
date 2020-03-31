import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MdmDepartmentComponent } from './mdm-department.component';

describe('MdmDepartmentComponent', () => {
  let component: MdmDepartmentComponent;
  let fixture: ComponentFixture<MdmDepartmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MdmDepartmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MdmDepartmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
