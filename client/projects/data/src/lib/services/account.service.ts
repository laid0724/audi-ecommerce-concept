import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { take, tap } from 'rxjs/operators';
import { Observable, ReplaySubject } from 'rxjs';
import { Roles } from '../enums';
import { User } from '../models/user';
import { CreditCard } from '../models/credit-card';
import { Address } from '../models/address';
import { SensitiveUserData } from '../models/sensitive-user-data';

interface UserCredential {
  userName: string;
  password: string;
}

interface RegisterRequest extends UserCredential, UserEmailBase {
  firstName: string;
  lastName: string;
}

interface UserEmailBase {
  email: string;
}

interface UserIdBase {
  userId: number;
}

interface UserTokenBase extends UserIdBase {
  token: string;
}

interface RolesUpsert extends UserIdBase {
  roles: Roles[];
}

interface CreditCardUpsert extends UserIdBase {
  creditCard: CreditCard;
}

interface PersonalInfoUpsert extends UserIdBase {
  firstName: string;
  lastName: string;
  gender: string;
  phoneNumber: string;
  address: Address;
  dateOfBirth: string;
}

interface ResetPasswordRequest extends UserTokenBase {
  newPassword: string;
}

interface ChangePasswordRequest extends UserIdBase {
  currentPassword: string;
  newPassword: string;
}

interface JwtToken {
  nameid: string;
  unique_name: string;
  role: string | string[];
  nbf: number;
  exp: number;
  iat: number;
}

@Injectable({
  // if set to root, no longer need to add into providers array in modules in newer versions of angular
  providedIn: 'root',
})
export class AccountService {
  private endpoint = '/api/account';

  private currentUserSource = new ReplaySubject<User | null>(1); // only store one value from the stream when next is triggered
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  setCurrentUser(user: User | null): void {
    if (user != null) {
      this.addRoleToUserFromToken(user);
      if (this.isTokenExpired(user.token)) {
        this.logout();
        return;
      }
    }

    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  register(request: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.endpoint}/register`, request).pipe(
      tap((user: User) => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  createModeratorAccount(request: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.endpoint}/create-moderator`, request);
  }

  login(userCredential: UserCredential): Observable<User> {
    return this.http.post<User>(`${this.endpoint}/login`, userCredential).pipe(
      take(1),
      tap((user: User) => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('user');
    this.currentUserSource.next(undefined);
    this.router.navigateByUrl('/');
  }

  changeUserRole(request: RolesUpsert): Observable<User> {
    return this.http.patch<User>(`${this.endpoint}/assign-role`, request);
  }

  lockoutUser(userId: number): Observable<null> {
    return this.http.patch<null>(`${this.endpoint}/lockout/${userId}`, null);
  }

  unlockUser(userId: number): Observable<null> {
    return this.http.patch<null>(`${this.endpoint}/unlock/${userId}`, null);
  }

  disableUser(userId: number): Observable<null> {
    return this.http.patch<null>(`${this.endpoint}/disable/${userId}`, null);
  }

  enableUser(userId: number): Observable<null> {
    return this.http.patch<null>(`${this.endpoint}/enable/${userId}`, null);
  }

  updateUserPersonalInfo(
    request: PersonalInfoUpsert
  ): Observable<SensitiveUserData> {
    return this.http.put<SensitiveUserData>(
      `${this.endpoint}/update-personal-info`,
      request
    );
  }

  updateCreditCard(request: CreditCardUpsert): Observable<SensitiveUserData> {
    return this.http.patch<SensitiveUserData>(
      `${this.endpoint}/credit-card`,
      request
    );
  }

  deleteCreditCard(userId: number): Observable<SensitiveUserData> {
    return this.http.delete<SensitiveUserData>(
      `${this.endpoint}/credit-card/${userId}`
    );
  }

  deleteUserImage(userId: number): Observable<null> {
    return this.http.delete<null>(`${this.endpoint}/image/${userId}`);
  }

  confirmUserEmail(request: UserTokenBase): Observable<User> {
    return this.http.post<User>(`${this.endpoint}/confirm-email`, request);
  }

  forceConfirmUserEmail(request: UserIdBase): Observable<User> {
    return this.http.post<User>(
      `${this.endpoint}/force-confirm-email`,
      request
    );
  }

  resendEmailConfirmationEmail(request: UserEmailBase): Observable<null> {
    return this.http.post<null>(
      `${this.endpoint}/resend-verification`,
      request
    );
  }

  resetUserPassword(request: ResetPasswordRequest): Observable<User> {
    return this.http.post<User>(`${this.endpoint}/reset-password`, request);
  }

  changeUserPassword(request: ChangePasswordRequest): Observable<User> {
    return this.http.post<User>(`${this.endpoint}/change-password`, request);
  }

  forgotPassword(request: UserEmailBase): Observable<null> {
    return this.http.post<null>(`${this.endpoint}/forgot-password`, request);
  }

  getDecodedToken(token: string): JwtToken {
    // atob is a method that allows us to decrypt the parts of a JWT token that does not require a signature
    // [1] refers to the payload property inside a JWT token
    return JSON.parse(atob(token.split('.')[1]));
  }

  addRoleToUserFromToken(user: User): void {
    const token = this.getDecodedToken(user.token);
    user.roles = [];
    const roles = token.role as Roles | Roles[];
    Array.isArray(roles) ? (user.roles = roles) : user.roles.push(roles);
  }

  isTokenExpired(token: string): boolean {
    const expiry = this.getDecodedToken(token).exp;
    return Math.floor(new Date().getTime() / 1000) >= expiry;
  }
}
