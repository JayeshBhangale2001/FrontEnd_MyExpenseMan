import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-reusable-table',
  templateUrl: './reusable-table.component.html',
  styleUrls: ['./reusable-table.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    NgIf,
    NgFor,
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ]
})
export class ReusableTableComponent implements OnInit, OnChanges {

  @Input() columns: string[] = [];
  @Input() data: any[] = [];
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.displayedColumns = this.columns;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      console.log('Data changed:', this.data);
      this.dataSource.data = this.data;
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    }
  }
  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    
    // Split the filter value by semicolons to get separate filter groups
    const semicolonGroups = filterValue.split(';').map(group => group.trim()).filter(group => group.length > 0);
  
    // Set the filter predicate
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      // Check if any of the semicolon-separated filters match
      return semicolonGroups.some(group => {
        // Split each group by commas and trim values
        const commaFilters = group.split(',').map(f => f.trim()).filter(f => f.length > 0);
  
        // Check if the current data row matches all filters in the group
        return commaFilters.every(filter => 
          Object.values(data).some(value =>
            value && value.toString().toLowerCase().includes(filter)
          )
        );
      });
    };
  
    // Apply the filter
    this.dataSource.filter = filterValue;
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  
  
  
  editRecord(record: any) {
    this.edit.emit(record);
  }

  deleteRecord(record: any) {
    this.delete.emit(record);
  }
}
