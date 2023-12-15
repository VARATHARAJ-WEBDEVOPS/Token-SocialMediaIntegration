import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  isShowPassword: Boolean = false;

  constructor(private authService: AuthService,
    private router: Router) { }

  alert(message: string, mood: String) {
    Swal.fire({
      title: mood === "good" ? 'Yep!' : 'Oops!',
      text: `${message}`,
      icon: mood === "good" ? 'success' : 'error',
      confirmButtonText: 'Got it!'
    });
  }

  togglePasswordMode() {
    this.isShowPassword = !this.isShowPassword;
  }

  ngOnInit(): void {
    console.log(this.authService.authChecking());
    if (this.authService.authChecking()) {
      this.router.navigateByUrl('dashboard');
    }
  }

  userModel = {
    email: '',
    password: ''
  }

  login() {
    this.authService.login(this.userModel).subscribe(
      (res: any) => {
        this.alert(res.message, "good");
        localStorage.setItem('auth', JSON.stringify(res.data));
        this.router.navigateByUrl('/dashboard');
      }, (err: any) => {
        this.alert(err.error.message, 'bad');
      }
    )
  }

  validation() {
    if (this.validateEmail() && this.validatePassword()) {
      this.login();
    }
  }

  validateEmail(): boolean {
    const validation = this.validateEmailAddress(this.userModel.email);
    switch (validation) {
      case 'valid':
        return true;
      case 'missingAtSymbol':
        this.alert('Email address should contain "@" symbol.', 'bad');
        break;
      case 'invalidDomain':
        this.alert('Please enter a valid domain name.', 'bad');
        break;
      case 'uppercaseLetters':
        this.alert('Email should not contain uppercase letters.', 'bad');
        break;
      case 'empty':
        this.alert('Email is Required.', 'bad');
        break;
      default:
        this.alert('Please enter a valid email address.', 'bad');
        break;
    }
    return false;
  }


  validateEmailAddress(email: string): string {
    if (!email) {
      return 'empty';
    }

    const hasUppercase = /[A-Z]/.test(email);
    if (hasUppercase) {
      return 'uppercaseLetters';
    }

    const atIndex = email.indexOf('@');
    if (atIndex === -1) {
      return 'missingAtSymbol';
    }

    const domain = email.substring(atIndex + 1);
    if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(domain)) {
      return 'invalidDomain';
    }

    return 'valid';
  }

  validatePassword(): boolean {
    const validation = this.validatePasswordStrength(this.userModel.password);
    switch (validation) {
      case 'valid':
        return true;
      case 'length':
        this.alert('Password should be at least 8 characters long.', 'bad');
        break;
      case 'uppercase':
        this.alert('Password should contain at least one uppercase letter.', 'bad');
        break;
      case 'symbol':
        this.alert('Password should contain at least one symbol.', 'bad');
        break;
      case 'number':
        this.alert('Password should contain at least one number.', 'bad');
        break;
      default:
        this.alert('Password is Required.', 'bad');
        break;
    }
    return false; // Return false for any invalid password
  }

  validatePasswordStrength(password: string): string {
    if (!password) {
      return 'empty';
    }

    if (password.length < 8) {
      return 'length';
    }

    if (!/[A-Z]/.test(password)) {
      return 'uppercase';
    }

    if (!/\d/.test(password)) {
      return 'number';
    }

    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      return 'symbol';
    }

    return 'valid';
  }

}
