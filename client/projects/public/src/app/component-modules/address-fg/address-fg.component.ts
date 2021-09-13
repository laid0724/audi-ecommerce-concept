import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  LanguageCode,
  LanguageStateService,
  NUMBER_REGEX,
  PHONE_NUMBER_REGEX,
  TaiwanCityDistricts,
  TAIWAN_CITY_DISTRICT_LIST,
} from '@audi/data';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

export const addressFormGroupBuilder = (
  fb: FormBuilder,
  language: LanguageCode
) =>
  fb.group({
    firstName: [null, [Validators.required]],
    lastName: [null, [Validators.required]],
    country: [language === 'zh' ? '台灣' : 'Taiwan', [Validators.required]],
    state: [language === 'zh' ? '台灣' : 'Taiwan', [Validators.required]],
    city: [null, [Validators.required]],
    district: [null, [Validators.required]],
    addressLine: [null, [Validators.required]],
    postalCode: [
      null,
      [
        Validators.required,
        Validators.pattern(NUMBER_REGEX),
        Validators.minLength(3),
        Validators.maxLength(5),
      ],
    ],
    phoneNumber: [
      null,
      [Validators.required, Validators.pattern(PHONE_NUMBER_REGEX)],
    ],
  });

@Component({
  selector: 'audi-address-fg',
  templateUrl: './address-fg.component.html',
  styleUrls: ['./address-fg.component.scss'],
})
export class AddressFgComponent implements OnInit, OnDestroy {
  @Input() label: string;

  twCityDistricts: TaiwanCityDistricts[] = TAIWAN_CITY_DISTRICT_LIST;

  selectedCity: TaiwanCityDistricts | undefined;

  destroy$ = new Subject<boolean>();

  get fg(): FormGroup {
    return this.controlContainer.control as FormGroup;
  }

  get language(): LanguageCode {
    return this.languageService.getCurrentLanguage();
  }

  constructor(
    private controlContainer: ControlContainer,
    private languageService: LanguageStateService
  ) {}

  ngOnInit(): void {
    const cityFC = this.fg?.get('city') as FormControl;
    const districtFC = this.fg?.get('district') as FormControl;

    if (cityFC.value != null) {
      if (this.language === LanguageCode.Zh) {
        this.selectedCity = this.twCityDistricts.find(
          (c) => c.cityZh === cityFC.value
        );
      }
      if (this.language === LanguageCode.En) {
        this.selectedCity = this.twCityDistricts.find(
          (c) => c.cityEn === cityFC.value
        );
      }
    }

    if (districtFC.value == null) {
      districtFC.disable();
    }

    cityFC?.valueChanges
      .pipe(
        map((selectedCity: string) =>
          this.twCityDistricts.find(
            (c) =>
              (this.language === LanguageCode.Zh ? c.cityZh : c.cityEn) ===
              selectedCity
          )
        )
      )
      .subscribe((selectedCity: TaiwanCityDistricts | undefined) => {
        this.selectedCity = selectedCity;

        if (selectedCity == undefined) {
          districtFC.disable();
        } else {
          districtFC.enable();
        }

        districtFC.reset();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
