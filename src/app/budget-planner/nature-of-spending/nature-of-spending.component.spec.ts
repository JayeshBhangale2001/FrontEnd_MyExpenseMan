import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NatureOfSpendingComponent } from './nature-of-spending.component';

describe('NatureOfSpendingComponent', () => {
  let component: NatureOfSpendingComponent;
  let fixture: ComponentFixture<NatureOfSpendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NatureOfSpendingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NatureOfSpendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
