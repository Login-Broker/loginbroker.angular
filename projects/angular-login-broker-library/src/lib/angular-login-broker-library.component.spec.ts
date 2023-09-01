import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularLoginBrokerLibraryComponent } from './angular-login-broker-library.component';

describe('AngularLoginBrokerLibraryComponent', () => {
  let component: AngularLoginBrokerLibraryComponent;
  let fixture: ComponentFixture<AngularLoginBrokerLibraryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AngularLoginBrokerLibraryComponent]
    });
    fixture = TestBed.createComponent(AngularLoginBrokerLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
