import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LanguageStateService } from '@audi/data';
import { TranslocoService } from '@ngneat/transloco';
import { NotificationService } from '../../component-modules/audi-ui/services/notification-service/notification.service';

@Component({
  selector: 'audi-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  emailSubscriptionForm: FormGroup;

  currentYear: number = new Date().getFullYear();

  language$ = this.languageService.language$;

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

    this.notificationService.info(
      this.transloco.translate('emailSubscriptionSuccess'),
      3000
    );
  }
}
