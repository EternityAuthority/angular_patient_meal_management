/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NB_AUTH_OPTIONS, NbAuthService } from '@nebular/auth';
import { NbToastrService } from '@nebular/theme';
import { LoginClient } from '../../../Nutricalc-api';
import { Messages } from '../../../pages/Services/constants';
import { LoadingService } from '../../../pages/Services/loading.service';
import { getDeepFromObject } from '../../helpers';
import { EMAIL_PATTERN } from '../constants';

@Component({
  selector: 'ngx-request-password-page',
  styleUrls: ['./request-password.component.scss'],
  templateUrl: './request-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxRequestPasswordComponent implements OnInit {
  // redirectDelay: number = this.getConfigValue('forms.requestPassword.redirectDelay');
  // showMessages: any = this.getConfigValue('forms.requestPassword.showMessages');
  // strategy: string = this.getConfigValue('forms.requestPassword.strategy');

  showMessage: boolean = false;
  showError: boolean = false;
  isEmailRequired: boolean = this.getConfigValue('forms.validation.email.required');

  submitted = false;
  errors: string[] = [];
  messages: string[] = [];
  user: any = {};
  requestPasswordForm: FormGroup;

  constructor(protected service: NbAuthService,
    @Inject(NB_AUTH_OPTIONS) protected options = {},
    protected cd: ChangeDetectorRef,
    protected fb: FormBuilder,
    protected router: Router,
    private toast: NbToastrService,
    public load: LoadingService, private auth: LoginClient) { }

  get email() { return this.requestPasswordForm.get('email'); }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    const passwordValidators = [
      Validators.pattern(EMAIL_PATTERN),
    ];
    this.isEmailRequired && passwordValidators.push(Validators.required);

    this.requestPasswordForm = this.fb.group({
      email: this.fb.control('', [...passwordValidators]),
    });
  }

  requestPass(): void {
    this.submitted = true;
    try {
      this.auth.forgotPassword(this.requestPasswordForm.controls.email.value).subscribe(response => {
        this.submitted = false;
        if (response.succeeded === true) {
          this.toast.success('An e-mail containing password reset link has been sent to your registered e-mail account.');
          this.initForm();
        }
        else {
          this.toast.danger(response.errors);
        }
        this.cd.detectChanges();
      });
    } catch (error) {
      this.toast.danger(Messages.WRONG);
    }
  }

  getConfigValue(key: string): any {
    return getDeepFromObject(this.options, key, null);
  }
}
