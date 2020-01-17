import { Component, HostListener, ViewChild } from '@angular/core';
import { timer, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  key;
  key2;
  isRunning = false;
  time;
  source;
  sourceSub;
  timerSub;
  timerArray: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  sum;
  avg;
  edit: any = { double: false};
  isReady = false;

  ngOnInit() {
    this.timerSub = this.timerArray.subscribe(x => {
      this.sum = x.reduce((a, b) => a + b, 0);
      this.avg = (this.sum / x.length) || 0;
    })
  }

  toggleTimer() {
    this.isRunning = !this.isRunning;
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    if (this.isReady) {
      if(!this.key2 && this.key == event.key) {
        if (!this.isRunning) {
          this.isRunning = true;
          this.source = timer(0,0);
          this.sourceSub = this.source.subscribe(x => this.time = x);
        } else {
          this.isRunning = false;
          this.addData(this.time)
          this.sourceSub.unsubscribe();
        }
      } else if (this.key2) {
        if(this.key == event.key && !this.isRunning) {
          this.isRunning = true;
          this.source = timer(0,0);
          this.sourceSub = this.source.subscribe(x => this.time = x);
        } else if (this.key2 == event.key && this.isRunning) {
          this.isRunning = false;
          this.addData(this.time)
          this.sourceSub.unsubscribe();
        }
      }

    }
  }

  ready() {
    this.isReady = true
  }

  reset() {
    this.key = null;
    this.key2 = null;
  }

  setKey1(event: KeyboardEvent) {
    this.key = event.key;
  }

  setKey2(event: KeyboardEvent) {
    this.key2 = event.key;
  }

  clearKey2() {
    this.key2 = null;
  }

  addData(dataObj) {
    const currentValue = this.timerArray.value;
    const updatedValue = [...currentValue, dataObj];
    this.timerArray.next(updatedValue);
  }

  resetKey() {
    this.key = '';
  }

  ngOnDestroy() {
    this.timerSub.unsubscribe()
  }
}
