import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Homechild } from './homechild';

describe('Homechild', () => {
  let component: Homechild;
  let fixture: ComponentFixture<Homechild>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Homechild]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Homechild);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
