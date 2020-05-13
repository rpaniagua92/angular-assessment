import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Router } from '@angular/router';
import { Member } from '../member-details/member-details.component';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {
  members: Member[] = [];

  constructor(public appService: AppService, private router: Router) {}

  ngOnInit() {
    if (!this.appService.username || this.appService.username.length < 1) {
      this.router.navigate(['/login']);
    } else {
    this.appService.getMembers().subscribe(members => (this.members = members));
    }
  }

  goToAddMemberForm() {
    this.router.navigate(['/members_details']);
  }

  editMemberByID(id: number) {
    this.router.navigate(['/members_details'], { queryParams: { memberId: id } });
  }

  deleteMemberById(id: number) {
    this.appService.deleteMember(id).subscribe(deletedMember => {
      const newMembers = this.members.filter(obj => obj.id !== id);
      this.members = [...newMembers];
    });
  }
}
