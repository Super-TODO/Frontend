import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ItemRequest, ItemResponse, Status, Priority } from '../../models/item.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class ItemFormComponent implements OnInit {
  @Input() item: ItemResponse | null = null;
  @Output() formSubmit = new EventEmitter<ItemRequest>();
  @Output() formCancel = new EventEmitter<void>();

  itemForm: ItemRequest = {
    title: '',
    description: '',
    status: Status.TODO, 
    priority: Priority.LOW, 
    userId: 0
  };

  statuses: Status[] = [Status.TODO, Status.IN_PROGRESS, Status.DONE];
  priorities: Priority[] = [Priority.LOW, Priority.MEDIUM, Priority.HIGH];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUserProfile().subscribe({
      next: (profile) => {
        this.itemForm.userId = profile.id;
      },
      error: (error) => {
        console.error('Failed to load user profile:', error);
      }
    });
  }

  ngOnChanges(): void {
    if (this.item) {
      this.itemForm = {
        title: this.item.title,
        description: this.item.description,
        status: this.item.status, 
        priority: this.item.priority, 
        userId: this.item.userId
      };
    } else {
      this.itemForm = {
        title: '',
        description: '',
        status: Status.TODO,
        priority: Priority.LOW,
        userId: this.itemForm.userId
      };
    }
  }

  onSubmit(): void {
    this.formSubmit.emit(this.itemForm);
  }

  onCancel(): void {
    this.formCancel.emit();
  }
}