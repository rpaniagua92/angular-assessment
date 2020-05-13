import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { BannerComponent } from './banner/banner.component';
import { APP_BASE_HREF } from '@angular/common';
import { AppService } from './app.service';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AppComponent', () => {
  let service: AppService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent, BannerComponent],
      imports: [RouterModule.forRoot([]), HttpClientTestingModule],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    }).compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.get(AppService);
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'softrams-racing'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('softrams-racing');
  }));
  it(`should call Setusername`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;

    spyOn(service, 'setUsername');
    spyOn(localStorage, 'getItem').and.returnValue('username1');
    fixture.detectChanges();
    expect(localStorage.getItem).toHaveBeenCalledWith('username');
    expect(service.setUsername).toHaveBeenCalledWith('username1');
  }));
});
