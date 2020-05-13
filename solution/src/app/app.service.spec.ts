import { TestBed, inject } from '@angular/core/testing';

import { AppService } from './app.service';

import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Member } from './member-details/member-details.component';


describe('AppService', () => {
  let httpMock: HttpTestingController;
  let service: AppService;
  const dummyMember: Member = {
    id: 1,
    firstName: 'name1',
    lastName: 'lastName1',
    jobTitle: 'jobTitle1',
    team: 'team1',
    status: 'status1' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppService],
      imports: [HttpClientTestingModule]
    });
    httpMock = TestBed.get(HttpTestingController);
    service = TestBed.get(AppService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it(`should have as api 'http://localhost:8000/api'`, () => {
    expect(service.api).toEqual('http://localhost:8000/api');
    expect(service).toBeTruthy();
  });


  it('getMembers: should return an Observable<Member[]>', ()  => {
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
    service.getMembers().subscribe(members => {
      expect(members.length).toBe(2);
      expect(members).toEqual(dummyMembers);
    });
    const req = httpMock.expectOne(`${service.api}/members`);
    // getMembers should have made one request to GET members
    expect(req.request.method).toBe('GET');
    req.flush(dummyMembers);
  });

  it('getMember: should return a member object', () => {
    service.getMember('1').subscribe(member => {
      expect(member).toEqual(dummyMember);
    });
    const req = httpMock.expectOne(`${service.api}/members/` + 1);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.responseType).toEqual('json');
    // getMember should have made one request to GET member
    expect(req.request.method).toBe('GET');
    req.flush(dummyMember);
  });

  it('getMember: should turn 404 error into return of the requested member', () => {
    const msg = 'deliberate 404 error';
    service.getMember('3').subscribe(
      data => fail('should have failed with the 404 error'),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(404, 'status');
        expect(error.error).toEqual(msg, 'message');
      }
    );
    const req = httpMock.expectOne(`${service.api}/members/` + 3);
    // Respond with mock error
    req.flush(msg, { status: 404, statusText: 'Not Found' });
  });

  it('setUsername: should set username>', () => {
    expect(service.username).toBeUndefined();
    service.setUsername('user1');
    expect(service.username).toEqual('user1');
  });

  it('addMember: should add a member and return it', () => {
    service.addMember(dummyMember).subscribe(
      data => expect(data).toEqual(dummyMember, 'should return the member')
    );
    // addMember should have made one request to POST member
    const req = httpMock.expectOne(`${service.api}/addMember`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(dummyMember);

    // Expect server to return the member after POST
    const expectedResponse = new HttpResponse({ status: 201, statusText: 'Created', body: dummyMember });
    req.event(expectedResponse);
  });

  it('updateMember: should update a member and return it', () => {
    service.updateMember('1', dummyMember).subscribe(
      data => expect(data).toEqual(dummyMember, 'should return the member')
    );
    // updateMember should have made one request to PUT member
    const req = httpMock.expectOne(`${service.api}/updateMember/1`);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(dummyMember);

    // Expect server to return the member after PUT
    const expectedResponse = new HttpResponse({ status: 200, statusText: 'Updated', body: dummyMember });
    req.event(expectedResponse);
  });

  it('deleteMember: should delete a member', () => {
    service.deleteMember(1).subscribe();
    // deleteMember should have made one request to DELETE member
    const req = httpMock.expectOne(`${service.api}/deleteMember/1`);
    expect(req.request.method).toEqual('DELETE');

    // Expect server to return 200 status response after DELETE
    const expectedResponse = new HttpResponse({ status: 200, statusText: 'Deleted' });
    req.event(expectedResponse);
  });

  it('getTeams: should return an array of team objects', ()  => {
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
    service.getTeams().subscribe(teams => {
      expect(teams.length).toBe(2);
      expect(teams).toEqual(dummyTeams);
    });
    const req = httpMock.expectOne(`${service.api}/teams`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyTeams);
  });
});
