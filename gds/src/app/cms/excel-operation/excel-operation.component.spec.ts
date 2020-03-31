import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ExcelOperationComponent } from './excel-operation.component';

describe('ExcelOperationComponent', () => {
  let component: ExcelOperationComponent;
  let fixture: ComponentFixture<ExcelOperationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExcelOperationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcelOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
