import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private router: Router
  ) { }

  onSubmit() {
    if (this.loginForm.valid) {
      this.router.navigate(['/share-page']);
      localStorage.setItem('logIn', new Date().getTime().toString())
    }
  }
}