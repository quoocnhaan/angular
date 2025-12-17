import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  Firestore,
  collection,
  addDoc,
  doc,
  updateDoc
} from '@angular/fire/firestore';
import { Product } from '../models/product';

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

  form = this.fb.nonNullable.group({
    id: ['', Validators.required],
    name: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    quantity: [0, [Validators.required, Validators.min(0)]],
    image: ['', Validators.required],
    discount: [0, [Validators.min(0), Validators.max(100)]],
    description: [''],
    brand: ['', Validators.required],
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
        brand: this.product.brand
      });
    }
  }

  async submit() {
    if (this.form.invalid) return;

    const value = this.form.getRawValue();

    if (this.isEdit && this.product) {
      await updateDoc(
        doc(this.firestore, 'products', this.product.docId),
        {
          ...value,
          name_lower: value.name.toLowerCase(),
          brand_lower: value.brand.toLowerCase(),
        }
      );
    } else {
      await addDoc(collection(this.firestore, 'products'), {
        ...value,
        name_lower: value.name.toLowerCase(),
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
