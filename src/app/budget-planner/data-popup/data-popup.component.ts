import { Component, EventEmitter, Input, Output } from '@angular/core';
@Component({
  selector: 'app-data-popup',
  templateUrl: './data-popup.component.html',
  styleUrls: ['./data-popup.component.scss']
  
})
export class DataPopupComponent {
  @Input() data: any[] = []; // Data to display in the table
  @Input() displayedColumns: string[] = []; // Columns for the table
  @Output() close = new EventEmitter<void>(); // Event to close the popup

  onClose(): void {
    this.close.emit(); // Emit close event
  }
}
