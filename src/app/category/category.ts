import { Component, inject } from '@angular/core';
import { CategoriesService } from '../services/categories-service';
import { Observable } from 'rxjs';
import { Category } from '../models/categories';
import { CategoryForm } from '../category-form/category-form';
import { CommonModule } from '@angular/common';
import { Product } from '../models/product';
import { ProductsService } from '../services/products-service';

@Component({
  selector: 'app-category',
  imports: [CategoryForm, CommonModule],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class CategoryComponent {
  private categoriesService = inject(CategoriesService);
  private productsService = inject(ProductsService);

  categories!: Observable<Category[]>;
  products!: Observable<Product[]>;

  showForm = false;
  selectedCategory?: Category;

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.closeForm();
    this.categories = this.categoriesService.getCategories() as Observable<Category[]>;
  }

  async deleteCategory(category: Category) {
    if (!confirm('Are you sure you want to delete this category?')) return;


    const used = await this.productsService.hasProductsWithCategoryName(
      category.name
    );

    if (used) {
      alert(`Cannot delete "${category.name}" because products are using it.`);
      return;
    }

    this.categoriesService.deleteCategory(category.docId).subscribe(() => {
      console.log('Category deleted successfully');
    });
    this.loadCategories();
  }

  openCreate() {
    this.selectedCategory = undefined;
    this.showForm = true;
  }

  openEdit(p: Category) {
    console.log('Editing category:', p);
    this.selectedCategory = p;
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
  }
}
