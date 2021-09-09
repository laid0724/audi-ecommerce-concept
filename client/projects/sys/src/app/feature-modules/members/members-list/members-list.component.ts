import { OnDestroy, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ActivatedRoute,
  Data,
  QueryParamsHandling,
  Router,
} from '@angular/router';
import {
  AccountService,
  BusyService,
  hasSameValueValidator,
  Member,
  MemberParams,
  MembersService,
  objectIsEqual,
  PaginatedResult,
  Pagination,
  Roles,
  setQueryParams,
  stringToBoolean,
  User,
} from '@audi/data';
import { ClrDatagridStateInterface, ClrForm } from '@clr/angular';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { startWith, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import {
  ClrCustomBtnFilter,
  ClrServerSideStringFilter,
} from '../../../component-modules/clr-datagrid-utilities/datagrid-filters';

@Component({
  selector: 'audi-sys-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss'],
})
export class MembersListComponent implements OnInit, OnDestroy {
  @ViewChild(ClrForm, { static: false }) clrForm: ClrForm;
  createModeratorForm: FormGroup;
  createModeratorFormOpen: boolean = false;

  paging: Pagination;

  initialQueryParams = {
    pageNumber: 1,
    pageSize: 10,
    email: undefined,
    phoneNumber: undefined,
    gender: undefined,
    firstName: undefined,
    lastName: undefined,
    isDisabled: undefined,
    emailConfirmed: undefined,
  };

  currentUser$: Observable<User | null> = this.accountService.currentUser$;

  userType: 'member' | 'moderator';
  members: Member[];

  memberParams: MemberParams = this.initialQueryParams;

  emailFilter: ClrServerSideStringFilter = new ClrServerSideStringFilter(
    'email'
  );
  phoneNumberFilter: ClrServerSideStringFilter = new ClrServerSideStringFilter(
    'phoneNumber'
  );
  firstNameFilter: ClrServerSideStringFilter = new ClrServerSideStringFilter(
    'firstName'
  );
  lastNameFilter: ClrServerSideStringFilter = new ClrServerSideStringFilter(
    'lastName'
  );
  isDisabledFilter: ClrCustomBtnFilter = new ClrCustomBtnFilter('isDisabled');
  emailConfirmedFilter: ClrCustomBtnFilter = new ClrCustomBtnFilter(
    'emailConfirmed'
  );
  genderFilter: ClrCustomBtnFilter = new ClrCustomBtnFilter('gender');

  genderOptions = [
    { value: 'male', label: '男 Male' },
    { value: 'female', label: '女 Female' },
    { value: 'other', label: '其他 Other' },
    { value: null, label: null },
  ];

  datagridLoading = true;

  refresher$ = new Subject<MemberParams>();
  destroy$ = new Subject<boolean>();

  constructor(
    private accountService: AccountService,
    private memberService: MembersService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private busyService: BusyService,
    private toastr: ToastrService
  ) {
    // this will restart component when hitting the same route,
    // this way refresher will fire again when we reset query params
    router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.initCreateModeratorForm();

    this.route.data
      .pipe(
        tap((data: Data) => {
          this.datagridLoading = true;
          this.userType = data.userType;
        }),
        switchMap((data: Data) =>
          this.refresher$.pipe(
            startWith(this.memberParams),
            switchMap((params: MemberParams) => {
              if (data.userType === 'member') {
                return this.memberService.getMembers(this.memberParams);
              }
              if (data.userType === 'moderator') {
                return this.memberService.getModerators(this.memberParams);
              }
              return throwError('invalid user type');
            }),
            takeUntil(this.destroy$)
          )
        )
      )
      .subscribe((res: PaginatedResult<Member[]>) => {
        this.members = res.result;
        this.paging = res.pagination;
        this.datagridLoading = false;
        this.busyService.idle();
      });
  }

  refreshDatagrid(state: ClrDatagridStateInterface): void {
    if (
      this.datagridLoading ||
      state == null ||
      Object.keys(state).length === 0
    ) {
      return;
    }

    const oldState = this.memberParams;

    this.memberParams = {
      ...this.memberParams,
      pageNumber: state.page?.current as number,
      pageSize: state.page?.size as number,
      email: undefined,
      phoneNumber: undefined,
      gender: undefined,
      firstName: undefined,
      lastName: undefined,
      isDisabled: undefined,
      emailConfirmed: undefined,
    };

    if (state.filters) {
      for (const filter of state.filters) {
        const { property, value } = <{ property: string; value: string }>filter;
        if (
          ['email', 'phoneNumber', 'gender', 'firstName', 'lastName'].includes(
            property
          )
        ) {
          this.memberParams = {
            ...this.memberParams,
            [property]: value,
          };
        }
        if (['isDisabled', 'emailConfirmed'].includes(property)) {
          this.memberParams = {
            ...this.memberParams,
            [property]: stringToBoolean(value),
          };
        }
      }
    }

    if (!objectIsEqual(oldState, this.memberParams)) {
      this.refresher$.next(this.memberParams);
    }
  }

  initCreateModeratorForm(): void {
    this.createModeratorForm = this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      userName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8)]],
      confirmPassword: [
        null,
        [
          Validators.required,
          Validators.minLength(8),
          hasSameValueValidator('password'),
        ],
      ],
    });
  }

  isAdmin(userRoles: Roles[]): boolean {
    return userRoles.includes(Roles.Admin);
  }

  onDisable(userId: number): void {
    this.accountService
      .disableUser(userId)
      .pipe(take(1))
      .subscribe(() => this.refresher$.next(this.memberParams));
  }

  onEnable(userId: number): void {
    this.accountService
      .enableUser(userId)
      .pipe(take(1))
      .subscribe(() => this.refresher$.next(this.memberParams));
  }

  onForceConfirmEmail(userId: number): void {
    this.accountService
      .forceConfirmUserEmail({ userId })
      .pipe(take(1))
      .subscribe(() => this.refresher$.next(this.memberParams));
  }

  onResendConfirmEmail(email: string): void {
    this.accountService
      .resendEmailConfirmationEmail({ email })
      .pipe(take(1))
      .subscribe(() => this.toastr.success('Email sent', '信件已發送'));
  }

  onSendForgotPasswordEmail(email: string): void {
    this.accountService
      .forgotPassword({ email })
      .pipe(take(1))
      .subscribe(() => this.toastr.success('Email sent', '信件已發送'));
  }

  onCreateModerator(): void {
    if (this.createModeratorForm.invalid) {
      this.clrForm.markAsTouched();
      this.createModeratorForm.markAllAsTouched();
      return;
    }

    this.accountService
      .createModeratorAccount(this.createModeratorForm.value)
      .pipe(take(1))
      .subscribe(() => {
        this.refresher$.next(this.memberParams);
        this.closeCreateModeratorModal();
        this.toastr.success(
          'Moderator created successfully',
          '管理者帳戶建立成功'
        );
      });
  }

  closeCreateModeratorModal(): void {
    this.createModeratorFormOpen = false;
    this.createModeratorForm.reset();
  }

  resetQueryParams(queryParams = {}, queryParamsHandling = ''): void {
    this.paging.currentPage = 1;
    setQueryParams(
      this.router,
      this.route,
      queryParams,
      queryParamsHandling as QueryParamsHandling
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
