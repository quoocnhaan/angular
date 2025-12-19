import { Component, inject } from '@angular/core';
import { CategoriesService } from '../services/categories-service';
import { Observable } from 'rxjs';
import { Category } from '../models/categories';
import { CategoryForm } from '../category-form/category-form';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category',
  imports: [CategoryForm, CommonModule],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class CategoryComponent {
  categoriesService = inject(CategoriesService);
  categories!: Observable<Category[]>;


  showForm = false;
  selectedCategory?: Category;

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.closeForm();
    this.categories = this.categoriesService.getCategories();
  }

  deleteCategory(docId: string) {
    if (!confirm('Are you sure you want to delete this category?')) return;
    this.categoriesService.deleteCategory(docId);
  }

  openCreate() {
    this.selectedCategory = undefined;
    this.showForm = true;
  }

  openEdit(p: Category) {
    this.selectedCategory = p;
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
  }
}
