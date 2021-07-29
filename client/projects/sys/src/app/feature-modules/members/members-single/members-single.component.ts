import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, ParamMap } from '@angular/router';
import { Member, MembersService } from '@audi/data';
import { of, throwError } from 'rxjs';
import { take, switchMap, filter } from 'rxjs/operators';

@Component({
  selector: 'audi-sys-members-single',
  templateUrl: './members-single.component.html',
  styleUrls: ['./members-single.component.scss'],
})
export class MembersSingleComponent implements OnInit {
  userType: 'member' | 'moderator';
  member: Member;

  constructor(
    private memberService: MembersService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.data
      .pipe(
        switchMap((data: Data) => {
          this.userType = data.userType;

          if (data.userType !== 'member' && data.userType !== 'moderator') {
            return throwError('invalid user type');
          }

          return this.route.paramMap;
        }),
        filter((params: ParamMap) => params.has('userId')),
        switchMap((params: ParamMap) => {
          const userId = parseInt(params.get('userId') as string);
          if (this.userType === 'member') {
            return this.memberService.getMember(userId);
          }
          if (this.userType === 'moderator') {
            return this.memberService.getModerator(userId);
          }
          return of(null);
        }),
        take(1)
      )
      .subscribe((member: Member | null) => {
        if (member != null) {
          this.member = member;
        }
      });
  }
}
