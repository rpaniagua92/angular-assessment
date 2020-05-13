import { Component, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../app.service';
import { Router, ActivatedRoute } from '@angular/router';

// This interface may be useful in the times ahead...
export interface Member {
  id: number;
  firstName: string;
  lastName: string;
  jobTitle: string;
  team: string;
  status: string;
}

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit, OnChanges {
  memberModel: Member;
  memberForm: FormGroup;
  submitted = false;
  alertType: String;
  alertMessage: String;
  teams = [];
  action = 'Add';
  private memberId: string;

  constructor(private fb: FormBuilder, private appService: AppService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    if (!this.appService.username || this.appService.username.length < 1) {
      this.router.navigate(['/login']);
    } else {
      this.memberForm = this.fb.group({
        firstName: new FormControl('', Validators.required),
        lastName: new FormControl('', Validators.required),
        jobTitle: new FormControl('', Validators.required),
        team: new FormControl(null, Validators.required),
        status: new FormControl('', Validators.required)
      });
      this.appService.getTeams().subscribe(teams => (this.teams = teams));

      this.route.queryParams.subscribe((paramMap) => {
        if (paramMap.memberId) {
          this.action = 'Edit';
          this.memberId = paramMap.memberId;
          this.appService.getMember(this.memberId).subscribe(memberData => {
              this.memberForm.setValue({
              firstName: memberData.firstName,
              lastName: memberData.lastName,
              jobTitle: memberData.jobTitle,
              team: memberData.team,
              status: memberData.status
            });
          });
        } else {
          this.action = 'Add';
          this.memberId = null;
        }
      });
    }
  }

  ngOnChanges() {}

  // TODO: Add member to members
  onSubmit(form: FormGroup) {
    if (form.invalid) {
      return;
    }

    this.memberModel = form.value;
    if (this.action === 'Add') {
      this.appService.addMember(this.memberModel).subscribe(() => {
        this.router.navigate(['/members']);
      });
      } else {
        this.appService.updateMember(this.memberId, this.memberModel).subscribe(() => {
          this.router.navigate(['/members']);
        });
      }
  }
}
