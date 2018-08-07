
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyNav2Component } from './my-nav2.component';

describe('MyNav2Component', () => {
  let component: MyNav2Component;
  let fixture: ComponentFixture<MyNav2Component>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyNav2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyNav2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
