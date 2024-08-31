import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpendingCategoriesLabelsComponent } from './spending-categories-labels.component';

describe('SpendingCategoriesLabelsComponent', () => {
  let component: SpendingCategoriesLabelsComponent;
  let fixture: ComponentFixture<SpendingCategoriesLabelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpendingCategoriesLabelsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpendingCategoriesLabelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
