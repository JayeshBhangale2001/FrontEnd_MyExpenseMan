import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendingTimelineComponent } from './spending-timeline.component';

describe('SpendingTimelineComponent', () => {
  let component: SpendingTimelineComponent;
  let fixture: ComponentFixture<SpendingTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpendingTimelineComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpendingTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
