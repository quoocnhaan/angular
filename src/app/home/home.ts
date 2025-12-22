import { Component, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
} from '@angular/fire/firestore';
import { map, Observable, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { deleteDoc, doc } from 'firebase/firestore';
import { ProductFormComponent } from '../product-form/product-form';
import { Product } from '../models/product';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductFormComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  firestore: Firestore = inject(Firestore);

  products!: Observable<Product[]>;

  searchText = '';
  category = '';
  promoted = false;
  status: '' | 'in' | 'out' = '';

  showForm = false;
  selectedProduct?: Product;

  ngOnInit() {
    console.log('Home component initialized');
    this.loadProducts();
  }

  loadProducts() {
    const ref = collection(this.firestore, 'products');

    this.products = collectionData(ref, { idField: 'docId' }).pipe(
      map((items: any[]) => {
        let result = items.map(item => ({
          ...item,
          createdAt: item.createdAt?.toDate()
        }));

        if (this.searchText) {
          const text = this.searchText.toLowerCase();
          result = result.filter(p =>
            p.name.toLowerCase().includes(text)
          );
        }

        if (this.category) {
          const text = this.category.toLowerCase();
          result = result.filter(p =>
            p.category.toLowerCase() === text
          );
        }

        if (this.promoted) {
          result = result.filter(p => p.discount > 0);
        }

        if (this.status === 'in') {
          result = result.filter(p => p.quantity > 0);
        }

        if (this.status === 'out') {
          result = result.filter(p => p.quantity === 0);
        }

        result.sort((a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );

        return result;
      }),
      tap(() => {
        this.closeForm();
      })
    ) as Observable<Product[]>;
  }


  deleteProduct(docId: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const ref = doc(this.firestore, 'products', docId);
    deleteDoc(ref);
  }

  openCreate() {
    this.selectedProduct = undefined;
    this.showForm = true;
  }

  openEdit(p: Product) {
    this.selectedProduct = p;
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
  }

}
