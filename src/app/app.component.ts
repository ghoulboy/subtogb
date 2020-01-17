import { Component, HostListener, ViewChild } from '@angular/core';
import { timer, BehaviorSubject } from 'rxjs';
import * as CanvasJS from '../assets/canvas/canvasjs.min';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  key;
  key2;
  max = 0;
  min = 0;
  counter: number = 0;
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
  chart;
  // CHART


  ngOnInit() {
    history.pushState(null, null, document.URL);
    window.addEventListener('popstate', function () {
      history.pushState(null, null, document.URL);
    });


    this.timerSub = this.timerArray.subscribe(x => {

      this.sum = x.reduce((a, b) => a + b, 0);
      this.avg = (this.sum / x.length) || 0;
      if (x.length > 0) {
        this.max = x.reduce((a, b) => Math.max(a, b)); 
        this.min = x.reduce((a, b) => Math.min(a, b));
      }
    })

    //CHART
    this.chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      theme: "light2",
      title:{},
      axisY:{
        includeZero: false
      },
      data: [{        
        type: "line",       
        dataPoints: []
      }]
    });
      
    this.chart.render();
  }

  toggleTimer() {
    this.isRunning = !this.isRunning;
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: any) { 
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
            const toMs = this.counter / 1000
            if (toMs < .2) {
              this.addData(toMs)
            }
            this.counter = 0;
            clearInterval(this.timerRef);
          }
        } else if (this.key2) {
          if(this.key == event.key && !this.isRunning) {
            this.isRunning = true;
            const startTime = Date.now() - (this.counter || 0);
            this.timerRef = setInterval(() => {
              this.counter = Date.now() - startTime;
            });
          } else if ((this.key2 == event.key || (this.key2 == 'mouse button 4' && event.button == 3 || this.key2 == 'mouse button 5' && event.button == 4)) && this.isRunning) {
            this.isRunning = false;
            const toMs = this.counter / 1000
            if (toMs < .2) {
              this.addData(toMs)
            }
            this.counter = 0;
            clearInterval(this.timerRef);
          }
      }
    }
  }

  ready() {
    this.isReady = true;
  }

  clearKeys() {
    this.key = null;
    this.key2 = null;
    this.isReady = false;
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

    var dataPoint = {y: dataObj}
    this.chart.data[0].dataPoints.push(dataPoint)
    this.chart.render();
  }

  resetData() {
    this.timerArray.next([]);
    this.chart.data[0].dataPoints.length = 0;
    this.chart.render();
    this.max = 0;
    this.min = 0;
  }

  onClick(e) {
    e.stopPropagation();
    e.preventDefault();
    console.log(e)
  }

  resetKey() {
    this.key = '';
  }

  ngOnDestroy() {
    this.timerSub.unsubscribe()
  }

  //CHART CODE
	
}
