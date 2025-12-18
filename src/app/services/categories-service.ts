import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Category } from '../models/categories';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  http = inject(HttpClient);

  getCategories() {
    return this.http.get<Category[]>('/api/categories');
  }

  insertCategory(category: Category) {
    return this.http.post<Category>('/api/categories', category);
  }

  updateCategory(category: Category) {
    return this.http.put<Category>('/api/categories', category);
  }

  deleteCategory(categoryDocId: string) {
    return this.http.delete<void>('/api/categories', { body: { docId: categoryDocId } });
  }
}
