import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import {SeriesAiringToday} from "../../interfaces/SeriesAiringToday";
import {SerieAiringToday} from "../../interfaces/SerieAiringToday";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  seriesToday: Array<SerieAiringToday>;
  seriesTomorrow: Array<SerieAiringToday>;
  seriesDayAfterTomorrow: Array<SerieAiringToday>;

  constructor(public navCtrl: NavController, public httpClient: HttpClient) {
    let seriesJsonToday = this.httpClient.get('http://127.0.0.1:8000/?date=24_05_2018');
    seriesJsonToday.subscribe(data => {
      console.log(data);
      let seriesAiringToday: SeriesAiringToday = <SeriesAiringToday>data;
      this.seriesToday = seriesAiringToday.series
    });

    let seriesJsonTomorrow = this.httpClient.get('http://127.0.0.1:8000/?date=25_05_2018');
    seriesJsonTomorrow.subscribe(data => {
      console.log(data);
      let seriesAiringToday: SeriesAiringToday = <SeriesAiringToday>data;
      this.seriesTomorrow = seriesAiringToday.series
    });

    let seriesJsonDayAfterTomorrow = this.httpClient.get('http://127.0.0.1:8000/?date=26_05_2018');
    seriesJsonDayAfterTomorrow.subscribe(data => {
      console.log(data);
      let seriesAiringToday: SeriesAiringToday = <SeriesAiringToday>data;
      this.seriesDayAfterTomorrow = seriesAiringToday.series
    });
  }

  serieSelected(series: SerieAiringToday) {

  }


}
