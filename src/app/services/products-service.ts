import { inject, Injectable } from '@angular/core';
import { collection, Firestore, getDocs, query, where, writeBatch } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private firestore = inject(Firestore);

  async hasProductsWithCategoryName(categoryName: string): Promise<boolean> {
    const ref = collection(this.firestore, 'products');
    const q = query(ref, where('category', '==', categoryName));

    const snapshot = await getDocs(q);
    return !snapshot.empty;
  }

  async updateProductsCategory(
    oldCategoryName: string,
    newCategoryName: string
  ): Promise<void> {
    const ref = collection(this.firestore, 'products');
    const q = query(ref, where('category', '==', oldCategoryName));

    const snapshot = await getDocs(q);

    if (snapshot.empty) return;

    const batch = writeBatch(this.firestore);

    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { category: newCategoryName });
    });

    await batch.commit();
  }

}
