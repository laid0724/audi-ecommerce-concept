import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  LanguageCode,
  LanguageStateService,
  NotificationService,
} from '@audi/data';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'audi-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  emailSubscriptionForm: FormGroup;

  currentYear: number = new Date().getFullYear();

  get language(): LanguageCode {
    return this.languageService.getCurrentLanguage();
  }

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private transloco: TranslocoService,
    private languageService: LanguageStateService
  ) {}

  ngOnInit(): void {
    this.initEmailSubscriptionForm();
  }

  initEmailSubscriptionForm(): void {
    this.emailSubscriptionForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
    });
  }

  onSubmitEmailSubscription(): void {
    if (this.emailSubscriptionForm.invalid) {
      this.emailSubscriptionForm.markAllAsTouched();
      return;
    }

    this.emailSubscriptionForm.reset();

    this.notificationService.success(
      this.transloco.translate('notifications.emailSubscriptionSuccess'),
      this.transloco.translate('notifications.success'),
      3000
    );
  }
}
