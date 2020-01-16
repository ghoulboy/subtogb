import { Component, HostListener } from '@angular/core';
import { timer, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  key;
  key2;
  counter: number;
  timerRef;
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
              const startTime = Date.now() - (this.counter || 0);
              this.timerRef = setInterval(() => {
              this.counter = Date.now() - startTime;
            });
          } else {
            this.isRunning = false;
            this.addData(this.counter)
            this.counter = undefined;
            clearInterval(this.timerRef);
          }
        } else if (this.key2) {
          if(this.key == event.key && !this.isRunning) {
            this.isRunning = true;
            const startTime = Date.now() - (this.counter || 0);
            this.timerRef = setInterval(() => {
              this.counter = Date.now() - startTime;
            });
          } else if (this.key2 == event.key && this.isRunning) {
            this.isRunning = false;
            this.addData(this.counter)
            this.counter = undefined;
            clearInterval(this.timerRef);
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
