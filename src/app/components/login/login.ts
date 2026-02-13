import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { ApiService } from '../../services/api.service';
import { Login } from '../../interfaces/login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ButtonModule, CheckboxModule, InputTextModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {

  constructor(
    private api: ApiService,
    private router: Router
  ) {}

  loginData: Login = {
    username: '',
    password: ''
  }

  login() {
    if(this.api.login(this.loginData)) {
      this.router.navigate(['/services']);
    } else {
      console.log('baj van')
    }
  }
}
