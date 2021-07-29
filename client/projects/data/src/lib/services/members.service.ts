import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Member } from '../models/member';
import { MemberParams } from '../models/member-params';
import { PaginatedResult } from '../models/pagination';
import { getPaginatedResult, getPaginationHeaders } from '../helpers';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  private endpoint = '/api/members';

  constructor(private http: HttpClient) {}

  getMembers(
    memberParams: MemberParams
  ): Observable<PaginatedResult<Member[]>> {
    const { pageNumber, pageSize, ...restOfMemberParams } = memberParams;
    let params = getPaginationHeaders(pageNumber, pageSize);

    Object.keys(restOfMemberParams).forEach((key) => {
      const property = (restOfMemberParams as unknown as any)[key];
      if (property != null) {
        params = params.append(key, property.toString());
      }
    });

    return getPaginatedResult<Member[]>(this.http, this.endpoint, params);
  }

  getMember(userId: number): Observable<Member> {
    return this.http.get<Member>(`${this.endpoint}/${userId}`);
  }

  getModerators(
    memberParams: MemberParams
  ): Observable<PaginatedResult<Member[]>> {
    const { pageNumber, pageSize, ...restOfMemberParams } = memberParams;
    let params = getPaginationHeaders(pageNumber, pageSize);

    Object.keys(restOfMemberParams).forEach((key) => {
      const property = (restOfMemberParams as unknown as any)[key];
      if (property != null) {
        params = params.append(key, property.toString());
      }
    });

    return getPaginatedResult<Member[]>(
      this.http,
      `${this.endpoint}/moderators`,
      params
    );
  }

  getModerator(userId: number): Observable<Member> {
    return this.http.get<Member>(`${this.endpoint}/moderators/${userId}`);
  }
}
