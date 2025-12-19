import { Component, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
  orderBy,
  startAt,
  endAt,
  addDoc
} from '@angular/fire/firestore';
import { map, Observable, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { deleteDoc, doc} from 'firebase/firestore';
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
  brand = '';
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
    let q = query(ref, orderBy('name_lower'));

    if (this.searchText) {
      const text = this.searchText.toLowerCase();
      q = query(ref, orderBy('name_lower'), startAt(text), endAt(text + '\uf8ff'));
    }

    if (this.brand) {
      const text = this.brand.toLowerCase();
      q = query(q, where('brand_lower', '==', text));
    }

    if (this.promoted) {
      q = query(q, where('discount', '>', 0));
    }

    if (this.status === 'in') {
      q = query(q, where('quantity', '>', 0));
    }

    if (this.status === 'out') {
      q = query(q, where('quantity', '==', 0));
    }

    this.products = collectionData(q, { idField: 'docId' }).pipe(
      map((items: any[]) =>
        items.map(item => ({
          ...item,
          createdAt: item.createdAt?.toDate()
        }))
      ),
      tap(items => {
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
