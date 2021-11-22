import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { PASSWORD_PATTERN } from '../../../@auth/components';
import { LoginClient } from '../../../Nutricalc-api';
import { Messages } from '../../Services/constants';
import { LoadingService } from '../../Services/loading.service';
import { UserService } from '../../Services/user.service';

@Component({
  selector: 'ngx-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {

  passwordForm: FormGroup;

  get currentPassword() { return this.passwordForm.get('currentPassword'); }

  get password() { return this.passwordForm.get('password'); }

  get confirmPassword() { return this.passwordForm.get('confirmPassword'); }

  constructor(private fb: FormBuilder, private toastrService: NbToastrService,
    public load: LoadingService, private auth: LoginClient,
    private user: UserService) {
    this.initForm();
  }

  ngOnInit(): void {
  }

  initForm() {
    this.passwordForm = this.fb.group({
      currentPassword: this.fb.control(null, [Validators.required]),
      password: this.fb.control(null, [Validators.required, Validators.pattern(PASSWORD_PATTERN)]),
      confirmPassword: this.fb.control(null, [Validators.required])
    });
  }

  updatePassword() {
    if (this.passwordForm.valid && (this.passwordForm.controls.password.value === this.passwordForm.controls.confirmPassword.value)
      && this.passwordForm.controls.currentPassword.value.trim() !== '') {
      try {
        const user = this.user.currentUser$.value;
        this.auth.updatePassword(user.contactEmail, this.passwordForm.controls.currentPassword.value,
          this.passwordForm.controls.password.value).subscribe(response => {
            if (response.succeeded === true) {
              this.initForm();
              this.toastrService.success('Password changed successfully');
            }
            else if (response.succeeded === false) {
              this.toastrService.danger('', response.errors);
            }
          });
      } catch (error) {
        this.toastrService.danger('', Messages.WRONG);
      }
    }
    else {
      this.toastrService.info('', 'Please enter valid details');
    }
  }

}
