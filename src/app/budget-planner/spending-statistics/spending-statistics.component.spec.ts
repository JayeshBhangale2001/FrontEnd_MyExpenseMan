import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendingStatisticsComponent } from './spending-statistics.component';

describe('SpendingStatisticsComponent', () => {
  let component: SpendingStatisticsComponent;
  let fixture: ComponentFixture<SpendingStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpendingStatisticsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpendingStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
