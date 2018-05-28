import {Component, ViewChild} from '@angular/core';
import {NavController, Slides} from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import {SeriesAiringToday} from "../../interfaces/SeriesAiringToday";
import {Episode} from "../../interfaces/Episode";
import {FavoriteService} from "../../services/favorite/favorite";
import {EpisodeDetailPage} from "../episode/episode_detail";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private static readonly API_URL = "https://api.themoviedb.org/3/tv/tv_placeholder/season/season_placeholder/episode/episode_placeholder?api_key=a3098e7a0c2ad40520eab2ff867b1f76&language=en-US";
  private static readonly IMAGE_URL = "http://image.tmdb.org/t/p/w185/";

  @ViewChild(Slides) slides: Slides;

  private yesterday: Date = new Date();
  private today: Date = new Date();
  private tomorrow: Date = new Date();
  private tomorrowpp: Date = new Date();

  dateMap = new Map<number, Date>();
  currentIndex = 1;
  data: Array<Episode> = [];

  constructor(public navCtrl: NavController, public httpClient: HttpClient, public favService: FavoriteService) {
    this.initialize();
  }

  ionViewWillEnter() {
    this.getTodayEpisodes(this.dateMap.get(this.currentIndex));
  }

  private initialize() {
    this.yesterday.setDate(this.today.getDate() - 1);
    this.tomorrow.setDate(this.today.getDate() + 1);
    this.tomorrowpp.setDate(this.today.getDate() + 2);
    this.dateMap.set(0, this.yesterday);
    this.dateMap.set(1, this.today);
    this.dateMap.set(2, this.tomorrow);
    this.dateMap.set(3, this.tomorrowpp);
    this.getTodayEpisodes(this.today);
  }

  getCurrentDate(): string {
    return this.dateMap.get(this.currentIndex).toLocaleDateString("de-CH");
  }

  slideChanged() {
    console.log("slide change");
    this.currentIndex = this.slides.getActiveIndex();
    this.getTodayEpisodes(this.dateMap.get(this.currentIndex));
  }

  showDetail(episode: Episode) {
    this.navCtrl.push(EpisodeDetailPage, { "episode": episode });
  }

  private getTodayEpisodes(date: Date) {
    this.data = [];
    let favorites = this.favService.storedData.favs;
    let date_string = date.getDate().toString() + '_' + ("0" + (date.getMonth() + 1).toString()).slice(-2) + '_' + date.getFullYear().toString();
    let seriesJsonToday = this.httpClient.get('http://127.0.0.1:8000/?date=' + date_string);
    seriesJsonToday.subscribe(data => {
      let seriesAiringToday: SeriesAiringToday = <SeriesAiringToday>data;
      let series = seriesAiringToday.series;
      let seriesFavorite = [];
      for(let serie of series) {
        for(let fav of favorites) {
          if(serie.name.toLowerCase() === fav.name.toLowerCase()) {
            serie.serie_id = fav.serieId;
            serie.serie_poster_path = fav.poster_path;
            seriesFavorite.push(serie);
          }
        }
      }
      for (let serie of seriesFavorite) {
        let url = HomePage.API_URL;
        url = url.replace('tv_placeholder', serie.serie_id.toString());
        url = url.replace('season_placeholder', serie.season.toString());
        url = url.replace('episode_placeholder', serie.episode.toString());
        let episode_request = this.httpClient.get(url);
        episode_request.subscribe(value => {
          let episode: Episode = <Episode>value;
          episode.series_id = serie.serie_id;
          episode.series_name = serie.name;
          if (episode.still_path && serie.serie_poster_path) {
            episode.still_path = serie.serie_poster_path;
          } else {
            episode.still_path = "./assets/imgs/no_poster.png"
          }
          this.data.push(episode)
        });
      }
    });
  }
}
