import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppService } from '../app.service';
import { BannerComponent } from './banner.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('BannerComponent', () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;
  let router: Router;
  let service: AppService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BannerComponent ],
      imports: [ HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: Router,
          useClass: class {
            navigate = jasmine.createSpy('navigate');
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.get(AppService);
    router = TestBed.get(Router);
    fixture = TestBed.createComponent(BannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it(`logout: should call Setusername`, async(() => {
    service.username = 'user1';
    spyOn(localStorage, 'removeItem');
    component.logout();
    expect(service.username).toEqual('');
    expect(localStorage.removeItem).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  }));
});
