import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  Firestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  collectionData
} from '@angular/fire/firestore';
import { Product } from '../models/product';
import { Category } from '../models/categories';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.html'
})
export class ProductFormComponent implements OnInit {

  @Input() product?: Product;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private firestore = inject(Firestore);

  isEdit = false;

  categories!: Observable<Category[]>;

  form = this.fb.nonNullable.group({
    id: ['', Validators.required],
    name: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    quantity: [0, [Validators.required, Validators.min(0)]],
    image: ['', Validators.required],
    discount: [0, [Validators.min(0), Validators.max(100)]],
    description: [''],
    category: ['', Validators.required],
  });

  ngOnInit(): void {
    if (this.product) {
      this.isEdit = true;
      this.form.patchValue({
        id: this.product.id,
        name: this.product.name,
        price: this.product.price,
        quantity: this.product.quantity,
        image: this.product.image,
        discount: this.product.discount,
        description: this.product.description,
        category: this.product.category
      });
    }
    const ref = collection(this.firestore, 'categories');

    this.categories = collectionData(ref, { idField: 'docId' }) as Observable<Category[]>;
  }

  async submit() {
    if (this.form.invalid) return;

    const value = this.form.getRawValue();

    if (this.isEdit && this.product) {
      await updateDoc(
        doc(this.firestore, 'products', this.product.docId),
        {
          ...value
        }
      );
    } else {
      await addDoc(collection(this.firestore, 'products'), {
        ...value,
        createdAt: new Date()
      });
    }

    this.saved.emit();
    this.form.reset();
  }

  cancel() {
    this.cancelled.emit();
  }
}
