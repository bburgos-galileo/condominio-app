import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  public currentUser?: any;
  constructor(private auth: Auth) { }

  async register({ email, password }) {
    try {
      const user = await createUserWithEmailAndPassword(this.auth, email, password);
      this.currentUser = user.user;
      return user;
    } catch (e) {
      return null;
    }
  }

  async login({ email, password }) {
    try {
      const user = await signInWithEmailAndPassword(this.auth, email, password);
      this.currentUser = user.user;
      sessionStorage.setItem('userEmail', email);
      return user;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  logout() {
    sessionStorage.clear();
    return signOut(this.auth);
  }
}
