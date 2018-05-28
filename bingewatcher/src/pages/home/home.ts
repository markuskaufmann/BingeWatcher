import {Component, ViewChild} from '@angular/core';
import {NavController, Slides} from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import {SeriesAiringToday} from "../../interfaces/SeriesAiringToday";
import {SerieAiringToday} from "../../interfaces/SerieAiringToday";
import {Episode} from "../../interfaces/Episode";
import {SearchResults} from "../../interfaces/SearchResults";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private static readonly TEMP_URL = "https://api.themoviedb.org/3/search/tv?api_key=a3098e7a0c2ad40520eab2ff867b1f76&language=de&query=";
  private static readonly API_URL = "https://api.themoviedb.org/3/tv/tv_placeholder/season/season_placeholder/episode/episode_placeholder?api_key=a3098e7a0c2ad40520eab2ff867b1f76&language=en-US";
  private static readonly IMAGE_URL = "http://image.tmdb.org/t/p/w185/";

  @ViewChild(Slides) slides: Slides;

  series: Array<SerieAiringToday>;
  seriesToday: Array<Episode>;
  seriesTomorrow: Array<Episode>;
  seriesDayAfterTomorrow: Array<Episode>;

  currentIndex = 1;

  seriesMap = new Map<number, Episode>();

  constructor(public navCtrl: NavController, public httpClient: HttpClient) {
    this.seriesToday = [];
    this.getData();
  }

  private getData() {
    let seriesJsonToday = this.httpClient.get('http://127.0.0.1:8000/?date=28_05_2018');
    seriesJsonToday.subscribe(data => {
      let seriesAiringToday: SeriesAiringToday = <SeriesAiringToday>data;
      this.series = seriesAiringToday.series;
      for (let serie of this.series) {
        console.log(serie);
        let results = this.httpClient.get(HomePage.TEMP_URL + serie.name);
        results.subscribe(data => {
          let serieDetail = <SearchResults> data;
          let serie_id = serieDetail.results[0];
          let url = HomePage.API_URL;
          url = url.replace('tv_placeholder', serie_id.id.toString());
          url = url.replace('season_placeholder', serie.season.toString());
          url = url.replace('episode_placeholder', serie.episode.toString());
          let episode_request = this.httpClient.get(url);
          episode_request.subscribe(value => {
            let episode: Episode = <Episode>value;
            episode.series_id = serie_id.id;
            episode.series_name = serie_id.name;
            if (episode.still_path) {
              episode.still_path = HomePage.IMAGE_URL + serie_id.poster_path;
            } else  {
              episode.still_path = "./assets/imgs/no_poster.png";
            }
            this.seriesToday.push(episode)
          });
        });
      }
    });
  }

  serieSelected(episode: Episode) {

  }

  slideChanged() {
    this.currentIndex = this.slides.getActiveIndex();
  }
}
