import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
}

export const LoginToUserRoute: RouteInfo[] = [
  { path: '/user', title: 'User' },
];



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

  test: Date = new Date();
  userItems: any[] = [];

  ngOnInit() {
    this.userItems = LoginToUserRoute.filter(userItem => userItem);
  }

  constructor(
    private router: Router
  ) { }

  onSubmit(): void {
    this.router.navigate(['/user']);
  }


}