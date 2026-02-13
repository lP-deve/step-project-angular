import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Homechild2 } from './homechild2';

describe('Homechild2', () => {
  let component: Homechild2;
  let fixture: ComponentFixture<Homechild2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Homechild2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Homechild2);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
