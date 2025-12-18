import { afterNextRender, computed, effect, inject, Injectable, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, authState } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  fauth: Auth = inject(Auth)
  router = inject(Router)
  private userSignal = signal<User | null>(null);

  public currentUser = this.userSignal.asReadonly();
  public isAuthenticated = computed(() => !!this.currentUser());

  constructor() {
    // QUAN TRỌNG: Chỉ lắng nghe Auth khi render xong ở phía Client
    // afterNextRender đảm bảo code này KHÔNG chạy trên Server (tránh lỗi window/localStorage)
    afterNextRender(() => {
      authState(this.fauth).subscribe((user) => {
        this.userSignal.set(user);
      });
    });


  }

  async CreateAccount(username: string, password: string) {
    return await createUserWithEmailAndPassword(this.fauth, username, password)
      .then(result => {
        var user = result.user;
        console.log(user)

      }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;

      });
  }

  async login(email: string, password: string) {

    try {
      await signInWithEmailAndPassword(this.fauth, email, password);
    } catch (error: any) {
      throw error;
    }
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(this.fauth, provider).then((result) => {
        const user = result.user;
        console.log(user);
        this.router.navigate(['/home']);
      });
    } catch (error) {
      console.error('Login Error:', error);
    }
  }

  async logout() {
    await signOut(this.fauth);
    this.router.navigate(['/login']);
  }
}
