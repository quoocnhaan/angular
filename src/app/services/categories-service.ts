import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Category } from '../models/categories';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private http = inject(HttpClient);

  private baseUrl = 'http://localhost:8000/api/categories';

  private jsonHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  //get
  getCategories() {
    return this.http.get<Category[]>(this.baseUrl, {
      headers: this.jsonHeaders,
    });
  }


  //post
  insertCategory(category: Category) {
    const body = {
      id: category.id,
      name: category.name,
      description: category.description,
    };

    return this.http.post<Category>(
      this.baseUrl,
      body,
      { headers: this.jsonHeaders }
    );
  }


  //put
  updateCategory(category: Category) {
    const body = {
      docId: category.docId,
      id: category.id,
      name: category.name,
      description: category.description,
    };

    return this.http.put<Category>(
      this.baseUrl,
      body,
      { headers: this.jsonHeaders }
    );
  }

  // delete
  deleteCategory(categoryDocId: string) {
    const body = { docId: categoryDocId };

    return this.http.delete<void>(
      this.baseUrl,
      {
        headers: this.jsonHeaders,
        body,
      }
    );
  }
}
