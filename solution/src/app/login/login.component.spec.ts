import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../app.service';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let service: AppService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, RouterModule, HttpClientModule],
      providers: [
        {
          provide: Router,
          useClass: class {
            navigate = jasmine.createSpy('navigate');
          }
        },
        HttpClient
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.get(AppService);
    router = TestBed.get(Router);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it(`login: should call setUsername`, async(() => {
    component.loginForm.setValue({
      username: 'username1',
      password: '123456',
    });

    spyOn(localStorage, 'setItem');
    spyOn(service, 'setUsername');
    component.login();
    expect(localStorage.setItem).toHaveBeenCalledWith('username', component.loginForm.value.username);
    expect(service.setUsername).toHaveBeenCalledWith(component.loginForm.value.username);
    expect(router.navigate).toHaveBeenCalledWith(['/members']);
  }));
});
