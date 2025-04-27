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
  searchTerm: string = '';
  statusFilter: Status | '' = '';
  priorityFilter: Priority | '' = '';
  errorMessage: string | null = null;
  isSidebarOpen: boolean = false;
  showForm: boolean = false;
  selectedItem: ItemResponse | null = null;
  currentPage: number = 0;
  totalPages: number = 0;
  pageSize: number = 10;

  constructor(
    private itemService: ItemService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.itemService.getItems(this.currentPage, this.pageSize).subscribe({
      next: (pageData) => {
        this.items = pageData.content;
        this.totalPages = pageData.totalPages;
        this.errorMessage = null;
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to load items. Please try again later.';
      }
    });
  }

  nextPage(): void {
    if (this.currentPage + 1 < this.totalPages) {
      this.currentPage++;
      this.loadItems();
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadItems();
    }
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
      this.itemService.updateItem(this.selectedItem.id, itemRequest).subscribe({
        next: () => {
          this.loadItems();
          this.showForm = false;
        },
        error: (error) => {
          this.errorMessage = error.message || 'Failed to update item. Please try again.';
        }
      });
    } else {
      this.itemService.addItem(itemRequest).subscribe({
        next: () => {
          this.loadItems();
          this.showForm = false;
        },
        error: (error) => {
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
