import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Category } from '../models/categories';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriesService } from '../services/categories-service';
import { ProductsService } from '../services/products-service';

@Component({
  selector: 'app-category-form',
  imports: [ReactiveFormsModule],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css',
})
export class CategoryForm {
  @Input() category?: Category;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  isEdit = false;
  categorieService = inject(CategoriesService);
  productsService = inject(ProductsService)

  form = this.fb.nonNullable.group({
    id: ['', Validators.required],
    name: ['', Validators.required],
    description: [''],
  });

  ngOnInit(): void {
    if (this.category) {
      this.isEdit = true;
      this.form.patchValue({
        id: this.category.id,
        name: this.category.name,
        description: this.category.description,
      });
    }
  }

  async submit() {
    if (this.form.invalid) return;

    const value = this.form.getRawValue();


    if (this.isEdit && this.category) {
      const oldName = this.category.name;
      var updatedCategory: Category = {
        docId: this.category.docId,
        id: value.id,
        name: value.name,
        description: value.description
      };

      this.categorieService.updateCategory(updatedCategory).subscribe(
        () => {
          this.saved.emit();
          this.form.reset();
          this.productsService.updateProductsCategory(oldName, value.name);
        });
    } else {
      this.categorieService.insertCategory(value as Category).subscribe(
        () => {
          this.saved.emit();
          this.form.reset();
        });
    }


  }

  cancel() {
    this.cancelled.emit();
  }
}
