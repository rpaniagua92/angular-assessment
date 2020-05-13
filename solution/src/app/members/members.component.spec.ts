import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MembersComponent } from './members.component';
import { Router } from '@angular/router';
import { AppService } from '../app.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Member } from '../member-details/member-details.component';
import { of } from 'rxjs';

describe('MembersComponent', () => {
  let component: MembersComponent;
  let fixture: ComponentFixture<MembersComponent>;
  let service: AppService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MembersComponent],
      imports: [HttpClientModule, RouterModule.forRoot([])],
      providers: [
        {
          provide: Router,
          useClass: class {
            navigate = jasmine.createSpy('navigate');
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.get(AppService);
    router = TestBed.get(Router);
    fixture = TestBed.createComponent(MembersComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', async(() => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  }));

  it('no user logged in - should navigate to login screen', () => {
    service.username = '';
    fixture.detectChanges();
    // no user logged in -> navigate to login screen
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('user logged in - should get members', () => {
    service.username = 'user1'; // user logged in
    const dummyMembers: Member[]  = [
      { id: 1,
        firstName: 'name1',
        lastName: 'lastName1',
        jobTitle: 'jobTitle1',
        team: 'team1',
        status: '' },
      { id: 2,
        firstName: 'name2',
        lastName: 'lastName2',
        jobTitle: 'jobTitle2',
        team: 'team2',
        status: 'status2' }
    ];
    spyOn(service, 'getMembers').and.callFake(() => {
      return of(dummyMembers);
    });
    fixture.detectChanges();
    expect(service.getMembers).toHaveBeenCalled();
    expect(component.members).toEqual(dummyMembers);
  });
});
