import {Component, ViewChild} from '@angular/core';
import {NavController, Slides} from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  @ViewChild(Slides) slides: Slides;

  private today: Date = new Date(Date.now());
  private tomorrow: Date = new Date(Date.now());
  private tomorrowpp: Date = new Date(Date.now());

  dateMap = new Map<number, Date>();
  currentIndex = 0;

  sampleData = Array(20).fill("sample data");

  constructor(public navCtrl: NavController) {
    this.initialize();
  }

  private initialize() {
    this.tomorrow.setDate(this.today.getDate() + 1);
    this.tomorrowpp.setDate(this.today.getDate() + 2);

    this.dateMap.set(0, this.today);
    this.dateMap.set(1, this.tomorrow);
    this.dateMap.set(2, this.tomorrowpp);
  }

  getCurrentDate(): string {
    return this.dateMap.get(this.currentIndex).toLocaleDateString("de-CH");
  }

  slideChanged() {
    this.currentIndex = this.slides.getActiveIndex();
  }
}
