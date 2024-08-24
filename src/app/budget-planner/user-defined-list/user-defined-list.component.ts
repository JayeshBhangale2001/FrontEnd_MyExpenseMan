import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-defined-lists',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-defined-list.component.html',
  styleUrls: ['./user-defined-list.component.scss']
})
export class UserDefinedListsComponent {
  listTypes = ['Expense Type', 'Income Type', 'Account Type'];
  selectedListType = '';
  newItemValue = '';

  items: { [key: string]: string[] } = {
    'Expense Type': ['Groceries', 'Utilities'],
    'Income Type': ['Salary', 'Freelance'],
    'Account Type': ['Savings', 'Checking']
  };

  addItem() {
    if (this.selectedListType && this.newItemValue) {
      this.items[this.selectedListType].push(this.newItemValue);
      this.newItemValue = '';
    }
  }

  onListTypeChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedListType = selectElement.value;
  }
}
