/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NB_AUTH_OPTIONS, NbAuthService } from '@nebular/auth';
import { NbToastrService } from '@nebular/theme';
import { LoginClient } from '../../../Nutricalc-api';
import { getDeepFromObject } from '../../helpers';
import { PASSWORD_PATTERN } from '../constants';

@Component({
  selector: 'ngx-reset-password-page',
  styleUrls: ['./reset-password.component.scss'],
  templateUrl: './reset-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxResetPasswordComponent implements OnInit {
  minLength: number = this.getConfigValue('forms.validation.password.minLength');
  maxLength: number = this.getConfigValue('forms.validation.password.maxLength');
  redirectDelay: number = this.getConfigValue('forms.resetPassword.redirectDelay');
  showMessages: any = this.getConfigValue('forms.resetPassword.showMessages');
  strategy: string = this.getConfigValue('forms.resetPassword.strategy');
  isPasswordRequired: boolean = this.getConfigValue('forms.validation.password.required');

  submitted = false;
  errors: string[] = [];
  messages: string[] = [];
  user: any = {};
  resetPasswordForm: FormGroup;

  userInfo: { email: string, eventId: string };

  constructor(protected service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    protected fb: FormBuilder,
    protected router: Router,
    private route: ActivatedRoute,
    private auth: LoginClient,
    private toast: NbToastrService) {
    this.userInfo = { email: this.route.snapshot.queryParamMap.get('userId'), eventId: this.route.snapshot.queryParamMap.get('eventId') };
  }

  ngOnInit(): void {
    const passwordValidators = [
      Validators.minLength(8),
      Validators.maxLength(50),
      Validators.pattern(PASSWORD_PATTERN)
    ];
    this.isPasswordRequired && passwordValidators.push(Validators.required);

    this.resetPasswordForm = this.fb.group({
      password: this.fb.control('', [...passwordValidators]),
      confirmPassword: this.fb.control('', [...passwordValidators]),
    });
  }

  get password() { return this.resetPasswordForm.get('password'); }
  get confirmPassword() { return this.resetPasswordForm.get('confirmPassword'); }

  resetPass(): void {
    this.errors = this.messages = [];
    this.submitted = true;
    this.user = this.resetPasswordForm.value;

    this.auth.resetPassword(this.userInfo.email, this.resetPasswordForm.controls.password.value,
      this.userInfo.eventId).subscribe((response) => {
        this.submitted = false;
        if (response.succeeded) {
          this.router.navigate(['/auth/login']);
          this.toast.success('Password has been changed successfully. Please login now', 'Success');
        }
        else if (!response.succeeded) {
          this.toast.danger(response.errors, 'Oops...');
        }
        this.cd.detectChanges();
      });
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}
