import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes
} from '@angular/animations';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  ValidationErrors
} from '@angular/forms';
import { Observable } from 'rxjs';

import { Authenticator } from 'app/auth/authenticator.service';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.css'],
  animations: [
    trigger('form', [
      state('true', style({ opacity: 1 })),
      state('false', style({ opacity: 0, display: 'none' })),
      transition('false => true', [
        animate(500, keyframes([style({ opacity: 0 }), style({ opacity: 1 })]))
      ]),
      transition('true => false', [style({ display: 'none' })])
    ])
  ]
})
export class AuthForm implements OnInit {
  @Output()
  authentication: EventEmitter<any> = new EventEmitter<any>();
  option: 'register' | 'login';
  registerForm: FormGroup;
  loginForm: FormGroup;
  isLoading: {
    gLogin: boolean;
    gRegister: boolean;
    login: boolean;
    register: boolean;
  };

  constructor(
    private message: NzMessageService,
    private auth: Authenticator,
    private http: HttpClient,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.option = 'login';
    this.isLoading = {
      gLogin: false,
      gRegister: false,
      login: false,
      register: false
    };
    this.registerForm = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email],
        [this.emailValidator.bind(this)] // Async
      ],
      name: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rPassword: [
        '',
        [Validators.required],
        [this.passwordValidator.bind(this)]
      ],
      submit: ['']
    });

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: [false]
    });
  }

  /**
   * Validates user input, then request login.
   * @param evt To prevent submit.
   */
  login(evt: Event) {
    evt.preventDefault();
    formGroupChecker(this.loginForm);
    if (!this.isLoading.login && this.loginForm.valid) {
      this.isLoading.login = true;
      this.auth.login(this.loginForm.value, 'local').subscribe(
        () => this.authentication.emit(true),
        err => {
          this.isLoading.login = false;
          const val = () => ({ error: true, wrong: true });
          if (err.error.message === 'User not found') {
            this.loginForm.get('email').setValidators(val);
            this.loginForm.get('email').markAsDirty();
            this.loginForm.get('email').updateValueAndValidity();
            this.loginForm.get('email').setValidators(Validators.required);
          } else if (err.error.message === 'Wrong password') {
            this.loginForm.get('password').setValidators(val);
            this.loginForm.get('password').markAsDirty();
            this.loginForm.get('password').updateValueAndValidity();
            this.loginForm.get('password').setValidators(Validators.required);
          } else {
            this.errorHandler(err);
          }
        }
      );
    }
  }

  /**
   * Validates user input, then request register.
   * @param evt To prevent submit.
   */
  register(evt: Event) {
    evt.preventDefault();
    if (!this.isLoading.register && this.registerForm.valid) {
      this.isLoading.register = true;
      this.http
        .post<any>('/api/auth/register/local', this.registerForm.value)
        .subscribe(
          () =>
            this.auth.login(this.registerForm.value, 'local').subscribe(
              () => this.authentication.emit(true),
              err => {
                this.isLoading.register = false;
                this.errorHandler(err);
              }
            ),
          err => {
            this.isLoading.register = false;
            this.errorHandler(err);
          }
        );
    } else {
      formGroupChecker(this.registerForm);
    }
  }

  /**
   * Performs Google login via the token provided by the button.
   * @param gToken Token provided by G button.
   */
  gLogin(gToken: string) {
    if (!this.isLoading.gLogin) {
      this.isLoading.gLogin = true;
      this.auth.login({ token: gToken }, 'google').subscribe(
        () => this.authentication.emit(true),
        err => {
          this.isLoading.gLogin = false;
          this.errorHandler(err);
        }
      );
    }
  }

  /**
   * Performs Google register via the token provided by the button.
   * @param gToken Token provided by G button.
   */
  gRegister(gToken: string) {
    if (!this.isLoading.gLogin) {
      this.isLoading.gRegister = true;
      this.http
        .post<any>('/api/auth/register/google', { token: gToken })
        .subscribe(
          () => {
            this.auth.login({ token: gToken }, 'google').subscribe(
              () => this.authentication.emit(true),
              err => {
                this.isLoading.gRegister = false;
                console.error(err);
              }
            );
          },
          err => {
            this.isLoading.gRegister = false;
            this.errorHandler(err);
          }
        );
    }
  }

  /**
   * Anounces some common errors when called.
   * @param err The error.
   */
  errorHandler(err: any) {
    let m;
    if (err.error && err.error.type === 'Registration error') {
      if (err.error.message === 'User already registered') {
        m = document.querySelector('#duplicated').innerHTML;
        this.message.error(m);
      }
    } else if (err.error && err.error.type === 'Authorization error') {
      if (err.error.message === 'User not found') {
        m = document.querySelector('#inexistent').innerHTML;
        this.message.error(m);
      }
    } else {
      m = document.querySelector('#unknown').innerHTML;
      console.log(err);
      this.message.error(m);
    }
  }

  /**
   * Validates password & confirm password to match.
   * @param control Confirm password control.
   */
  passwordValidator(control: FormControl) {
    return new Observable<ValidationErrors>(observer => {
      setTimeout(() => {
        if (this.registerForm.controls.password.value === control.value) {
          observer.next(null);
        } else {
          observer.next({ error: true, mismatch: true });
        }
        observer.complete();
      }, 500);
    });
  }

  /**
   * Validates that user does not already exists.
   * @param control Email control.
   */
  emailValidator(control: FormControl) {
    return new Observable<ValidationErrors>(observer => {
      setTimeout(
        () =>
          this.http
            .get<any[]>('/api/users', {
              params: {
                email: control.value
              }
            })
            .subscribe(users => {
              if (users.length === 1) {
                observer.next({ error: true, duplicated: true });
              } else if (users.length === 0) {
                observer.next(null);
              }
              observer.complete();
            }),
        500
      );
    });
  }
}

/**
 * Makes inputs dirty and validates them.
 * @param group Form group containing inputs to check.
 */
function formGroupChecker(group: FormGroup) {
  Object.keys(group.controls).forEach(c => {
    group.controls[c].markAsDirty();
    group.controls[c].updateValueAndValidity();
  });
}
