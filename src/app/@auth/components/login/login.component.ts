/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  NB_AUTH_OPTIONS,
  NbAuthSocialLink,
  NbAuthService,
} from '@nebular/auth';
import { getDeepFromObject } from '../../helpers';
import { NbThemeService, NbToastrService } from '@nebular/theme';
import { EMAIL_PATTERN } from '../constants';
import { InitUserService } from '../../../@theme/services/init-user.service';
import { LoginClient } from '../../../Nutricalc-api';
import { ROLES } from '../../roles';
import { LoadingService } from '../../../pages/Services/loading.service';
import { Messages } from '../../../pages/Services/constants';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class NgxLoginComponent implements OnInit {

  minLength: number = this.getConfigValue('forms.validation.password.minLength');
  maxLength: number = this.getConfigValue('forms.validation.password.maxLength');
  redirectDelay: number = this.getConfigValue('forms.login.redirectDelay');
  showMessages: any = this.getConfigValue('forms.login.showMessages');
  strategy: string = this.getConfigValue('forms.login.strategy');
  socialLinks: NbAuthSocialLink[] = this.getConfigValue('forms.login.socialLinks');
  rememberMe = this.getConfigValue('forms.login.rememberMe');
  isEmailRequired: boolean = this.getConfigValue('forms.validation.email.required');
  isPasswordRequired: boolean = this.getConfigValue('forms.validation.password.required');

  errors: string[] = [];
  messages: string[] = [];
  user: any = {};
  submitted: boolean = false;
  loginForm: FormGroup;
  alive: boolean = true;

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  constructor(protected service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    protected themeService: NbThemeService,
    private fb: FormBuilder,
    protected router: Router,
    protected initUserService: InitUserService,
    private auth: LoginClient,
    private toast: NbToastrService,
    public load: LoadingService) { }

  ngOnInit(): void {
    const emailValidators = [
      Validators.pattern(EMAIL_PATTERN),
    ];
    this.isEmailRequired && emailValidators.push(Validators.required);

    const passwordValidators = [
      Validators.minLength(this.minLength),
      Validators.maxLength(this.maxLength),
    ];
    this.isPasswordRequired && passwordValidators.push(Validators.required);

    this.loginForm = this.fb.group({
      email: this.fb.control('', [...emailValidators]),
      password: this.fb.control('', [...passwordValidators]),
      rememberMe: this.fb.control(false),
    });
  }

  login(): void {
    this.user = this.loginForm.value;
    this.errors = [];
    this.messages = [];
    this.submitted = true;
    try {
      this.auth.logIn(this.loginForm.controls.email.value, this.loginForm.controls.password.value, false)
        .subscribe(response => {
          this.submitted = false;
          if (response.token && response.status !== 'Fail') {
            localStorage.setItem('myAuthToken', response.token);
            localStorage.setItem('myAuthDetail', btoa(JSON.stringify({ userId: response.userId, userType: response.userType })));
            if (response.userType === ROLES.ADMIN) {
              this.router.navigate(['/pages/admin/']);
            }
            else if (response.userType === ROLES.BUSINESS) {
              this.router.navigate(['/pages/business/']);
            }
          }
          else if (response.status === 'Fail') {
            this.toast.danger('', 'Invalid email/password');
          }
          else if (response.status === 'User is not verified') {
            this.toast.info('', 'Please verify your account first');
          }
          this.cd.detectChanges();
        });
    } catch (error) {
      // console.log(error);
      this.toast.danger('', Messages.WRONG);
    }
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}
