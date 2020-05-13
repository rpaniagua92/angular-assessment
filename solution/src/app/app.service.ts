import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Member } from './member-details/member-details.component';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  api = 'http://localhost:8000/api';
  username: string;

  constructor(private http: HttpClient) {}

  // Returns all members
  getMembers() {
    return this.http
      .get<Member[]>(`${this.api}/members`)
      .pipe(catchError(this.handleError));
  }

  getMember(memberId: string) {
    return this.http
      .get(`${this.api}/members/` + memberId)
      .pipe(catchError(this.handleError));
  }

  setUsername(name: string): void {
    this.username = name;
  }

  addMember(memberForm: Member) {
    return this.http
      .post(`${this.api}/addMember`, memberForm);
  }

  updateMember(id: string, memberForm: Member) {
    return this.http
      .put(`${this.api}/updateMember/` + id, memberForm);
  }

  deleteMember(id: number) {
    return this.http
      .delete(`${this.api}/deleteMember/` + id);
  }

  getTeams() {
    return this.http
      .get(`${this.api}/teams`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return [];
  }
}
