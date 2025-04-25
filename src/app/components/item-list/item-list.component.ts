import { Component, OnInit } from '@angular/core';
import { ItemRequest, ItemResponse, Status, Priority } from '../../models/item.model';
import { ItemService } from '../../services/item.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ItemFormComponent } from '../item-form/item-form.component';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    ItemFormComponent
  ]
})
export class ItemListComponent implements OnInit {
  items: ItemResponse[] = [];
  filteredItems: ItemResponse[] = [];
  searchTerm: string = '';
  statusFilter: Status | '' = '';
  priorityFilter: Priority | '' = '';
  errorMessage: string | null = null;
  isSidebarOpen: boolean = false;
  showForm: boolean = false;
  selectedItem: ItemResponse | null = null;

  constructor(
    private itemService: ItemService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.itemService.getItems().subscribe({
      next: (items) => {
        this.items = items;
        this.errorMessage = null;
        this.applyFilters();
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to load items. Please try again later.';
      }
    });
  }

  applyFilters(): void {
    this.filteredItems = this.items.filter(item => {
      const matchesSearch = this.searchTerm
        ? item.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;

      const matchesStatus = this.statusFilter
        ? item.status === this.statusFilter
        : true;

      const matchesPriority = this.priorityFilter
        ? item.priority === this.priorityFilter
        : true;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  onPriorityFilterChange(): void {
    this.applyFilters();
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  showAddForm(): void {
    this.selectedItem = null;
    this.showForm = true;
  }

  showUpdateForm(item: ItemResponse): void {
    this.selectedItem = item;
    this.showForm = true;
  }

  onFormSubmit(itemRequest: ItemRequest): void {
    if (this.selectedItem) {
      // Update Item
      console.log('Updating item:', this.selectedItem.id, itemRequest); // Debug
      this.itemService.updateItem(this.selectedItem.id, itemRequest).subscribe({
        next: (updatedItem) => {
          console.log('Update successful:', updatedItem); // Debug
          this.loadItems();
          this.showForm = false;
        },
        error: (error) => {
          console.error('Update error:', error); // Debug
          this.errorMessage = error.message || 'Failed to update item. Please try again.';
        }
      });
    } else {
      // Add Item
      console.log('Adding item:', itemRequest); // Debug
      this.itemService.addItem(itemRequest).subscribe({
        next: (newItem) => {
          console.log('Add successful:', newItem); // Debug
          this.loadItems();
          this.showForm = false;
        },
        error: (error) => {
          console.error('Add error:', error); // Debug
          this.errorMessage = error.message || 'Failed to add item. Please try again.';
        }
      });
    }
  }

  onFormCancel(): void {
    this.showForm = false;
    this.selectedItem = null;
  }

  deleteItem(id: number): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.itemService.deleteItem(id).subscribe({
        next: () => {
          this.loadItems();
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to delete item. Please try again.';
        }
      });
    }
  }
}