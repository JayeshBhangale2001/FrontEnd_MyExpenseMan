import { Component, OnInit } from '@angular/core';
import { UserDefinedListService, UserDefinedListItem } from '../../user-defined-list.service';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-defined-lists',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-defined-list.component.html',
  styleUrls: ['./user-defined-list.component.scss']
})
export class UserDefinedListsComponent implements OnInit {
  listTypes: string[] = [];
  selectedListType = '';
  newItemValue = '';

  // Correct typing for items object
  items: { [key: string]: UserDefinedListItem[] } = {};

  constructor(private userDefinedListService: UserDefinedListService) {}

  ngOnInit(): void {
    this.loadListTypes();
  }

  loadListTypes() {
    this.userDefinedListService.getListTypes().subscribe(data => {
      this.listTypes = data;
    });
  }

  onListTypeChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedListType = selectElement.value;
    this.loadItems();
  }

  loadItems() {
    if (this.selectedListType) {
      this.userDefinedListService.getItems(this.selectedListType).subscribe(data => {
        // Store full UserDefinedListItem objects
        this.items[this.selectedListType] = data;
      });
    }
  }

  addItem() {
    if (this.selectedListType && this.newItemValue) {
      const newItem: UserDefinedListItem = {
        listType: this.selectedListType,
        itemName: this.newItemValue
      };
      this.userDefinedListService.saveItem(newItem).subscribe(() => {
        this.loadItems();
        this.newItemValue = '';
      });
    }
  }

  deleteItem(id: number | undefined) {
    if (id !== undefined) {
      this.userDefinedListService.deleteItem(id).subscribe(() => {
        this.loadItems();
      });
    }
  }
  
}
