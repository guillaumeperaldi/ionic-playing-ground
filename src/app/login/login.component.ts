import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  private timer: number;
  public keyboardActive: boolean = false;
  public showHidePassword: boolean = false;

  constructor(public readonly formBuilder: FormBuilder) {
    this.loginForm = formBuilder.group({
      login: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
      lang: ['', Validators.compose([Validators.required])],
    });
  }

  @HostListener('window:resize', ['$event']) onResize(): void {
    // debounce resize, wait for resize to finish before doing stuff
    clearTimeout(this.timer);
    this.timer = window.setTimeout(() => {
      this.keyboardActive = !this.keyboardActive;
    }, 250);
  }

  ngOnInit() {}

  login() {
    if (this.loginForm.invalid) {
      throw Error('INVALID_FORM');
    }
  }
}
