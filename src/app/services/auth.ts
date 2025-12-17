import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  fauth: Auth = inject(Auth)

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
}
