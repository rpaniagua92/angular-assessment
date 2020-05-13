import { async, ComponentFixture, TestBed, getTestBed, inject} from '@angular/core/testing';
import { MemberDetailsComponent } from './member-details.component';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule} from '@angular/common/http/testing';
import { AppService } from '../app.service';
import { of } from 'rxjs';

// Bonus points!
describe('MemberDetailsComponent', () => {
  let component: MemberDetailsComponent;
  let fixture: ComponentFixture<MemberDetailsComponent>;
  const formBuilder: FormBuilder = new FormBuilder();
  let service: AppService;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MemberDetailsComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot([]),
        HttpClientTestingModule
      ],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({
              memberId: 1,
            }),
          },
        },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.get(AppService);
    router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);

    fixture = TestBed.createComponent(MemberDetailsComponent);
    component = fixture.componentInstance;

    component.memberForm = formBuilder.group({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      jobTitle: new FormControl('', Validators.required),
      team: new FormControl(null, Validators.required),
      status: new FormControl('', Validators.required)
    });
    spyOn(router, 'navigate');
  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('no user logged in - should navigate to login screen', () => {
    fixture.detectChanges();
    // no user logged in -> navigate to login screen
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('user logged in - should get teams - set action to Edit', () => {
    service.username = 'user1'; // user logged in
    const dummyTeams  = [
      {
        id: 1,
        teamName: 'Formula 1 - Car 77'
      },
      {
        id: 2,
        teamName: 'Formula 1 - Car 8'
      },
    ];

    const dummyMember = {
      firstName: 'name1',
      lastName: 'lastName1',
      jobTitle: 'jobTitle1',
      team: 'team1',
      status: 'status1'
    };
    spyOn(service, 'getTeams').and.callFake(() => {
      return of(dummyTeams);
    });

    spyOn(service, 'getMember').and.callFake(() => {
      return of(dummyMember);
    });

    fixture.detectChanges();
    expect(service.getTeams).toHaveBeenCalled();
    expect(component.teams).toEqual(dummyTeams);
    expect(component.action).toEqual('Edit');

    expect(service.getMember).toHaveBeenCalled();
  });

  it('user logged in - set action to Add', () => {
    TestBed.get(ActivatedRoute).queryParams = of({ id: undefined}); // no id = new member
    service.username = 'user1'; // user logged in
    fixture.detectChanges();
    expect(component.action).toEqual('Add');
  });

  it('onSubmit: invalid form - do not set the memberModel', () => {
    component.memberForm.setValue({
      firstName: 'name1',
      lastName: 'lastName1',
      jobTitle: 'jobTitle1',
      team: 'team1',
      status: '' // invalid field
    });

    component.onSubmit(component.memberForm);
    expect(component.memberModel).toBeUndefined();
  });

  it('onSubmit: valid form - call addMember Method', () => {
    // valid form
    component.memberForm.setValue({
      firstName: 'name1',
      lastName: 'lastName1',
      jobTitle: 'jobTitle1',
      team: 'team1',
      status: 'status1'
    });
    component.action = 'Add';
    spyOn(service, 'addMember').and.callFake(() => {
      return of([]);
    });
    component.onSubmit(component.memberForm);
    expect(service.addMember).toHaveBeenCalled();
    expect(component.memberModel).toEqual(component.memberForm.value);
    // navigate to members screen to add new member
    expect(router.navigate).toHaveBeenCalledWith(['/members']);
  });

  it('onSubmit: valid form - call updateMember Method', () => {
    // valid form
    component.memberForm.setValue({
      firstName: 'name2',
      lastName: 'lastName2',
      jobTitle: 'jobTitle2',
      team: 'team2',
      status: 'status2'
    });
    component.action = 'Edit';
    spyOn(service, 'updateMember').and.callFake(() => {
      return of([]);
    });
    component.onSubmit(component.memberForm);
    expect(service.updateMember).toHaveBeenCalled();
    expect(component.memberModel).toEqual(component.memberForm.value);
    // navigate to members screen to edit member
    expect(router.navigate).toHaveBeenCalledWith(['/members']);
  });
});
