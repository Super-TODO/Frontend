import { Component, OnInit } from '@angular/core';
import { ItemResponse, Status, Priority } from '../../models/item.model';
import { ItemService } from '../../services/item.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent
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
}