import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Episode} from "../../interfaces/Episode";
import {SearchResults} from "../../interfaces/SearchResults";
import {SeriesAiringToday} from "../../interfaces/SeriesAiringToday";
import {HttpClient} from "@angular/common/http";
import {SerieDetail} from "../../interfaces/SerieDetail";
import {DetailPage} from "../detail/detail";
import {FavoriteService} from "../../services/favorite/favorite";

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  private static readonly SEARCH_URL = "https://api.themoviedb.org/3/search/tv?api_key=a3098e7a0c2ad40520eab2ff867b1f76&language=de&query=";
  private static readonly API_URL = "https://api.themoviedb.org/3/tv/tv_placeholder/season/season_placeholder/episode/episode_placeholder?api_key=a3098e7a0c2ad40520eab2ff867b1f76&language=en-US";
  private static readonly IMAGE_URL = "http://image.tmdb.org/t/p/w185/";
  private static readonly API_DETAIL_URL = "https://api.themoviedb.org/3/tv/";
  private static readonly API_DETAIL_QUERY = "?api_key=a3098e7a0c2ad40520eab2ff867b1f76&language=de";

  private yesterday: Date = new Date();
  private today: Date = new Date();
  private tomorrow: Date = new Date();
  private tomorrowpp: Date = new Date();

  detail: SerieDetail;
  detail_favorites: SerieDetail;
  dateMap = new Map<number, Date>();
  currentIndex = 1;
  data: Episode[] = [];

  constructor(public navCtrl: NavController, public httpClient: HttpClient, public favService: FavoriteService) {
    this.initialize();
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
    this.getTodayEpisodes(this.dateMap.get(this.currentIndex));
  }

  swipeLeft() {
    if (this.currentIndex > 0) {
      this.currentIndex = this.currentIndex - 1;
      this.slideChanged();
    }
  }

  swipeRight() {
    if (this.currentIndex < 3) {
      this.currentIndex = this.currentIndex + 1;
      this.slideChanged();
    }
  }

  showDetail(episode: Episode) {
    let results = this.httpClient.get(AboutPage.API_DETAIL_URL + episode.series_id + AboutPage.API_DETAIL_QUERY);
    results.subscribe(data => {
      let serieDetail = <SerieDetail> data;
      if (serieDetail.poster_path) {
        serieDetail.poster_path = AboutPage.IMAGE_URL + serieDetail.poster_path
      } else  {
        serieDetail.poster_path = "./assets/imgs/no_poster_detail.png"
      }
      this.detail = serieDetail;
    }, (error) => {
      console.log(error);
    }, () => {
      this.navCtrl.push(DetailPage, { "serie": this.detail });
    });
  }

  addToFavorites(episode: Episode) {
    let results = this.httpClient.get(AboutPage.API_DETAIL_URL + episode.series_id + AboutPage.API_DETAIL_QUERY);
    results.subscribe(data => {
      let serieDetail = <SerieDetail> data;
      if (serieDetail.poster_path) {
        serieDetail.poster_path = AboutPage.IMAGE_URL + serieDetail.poster_path
      } else  {
        serieDetail.poster_path = "./assets/imgs/no_poster_detail.png"
      }
      this.detail_favorites = serieDetail;
    }, (error) => {
      console.log(error);
    }, () => {
      this.favService.addOrSetFavorite(this.detail_favorites, false);
    });

  }

  private getTodayEpisodes(date: Date) {
    this.data = [];
    let date_string = date.getDate().toString() + '_' + ("0" + (date.getMonth() + 1).toString()).slice(-2) + '_' + date.getFullYear().toString();
    let seriesJsonToday = this.httpClient.get('http://127.0.0.1:8000/?date=' + date_string);
    seriesJsonToday.subscribe(data => {
      let seriesAiringToday: SeriesAiringToday = <SeriesAiringToday>data;
      let series = seriesAiringToday.series;
      for (let serie of series) {
        console.log(serie);
        let results = this.httpClient.get(AboutPage.SEARCH_URL + serie.name);
        results.subscribe(data => {
          let serieDetail = <SearchResults> data;
          let serie_id = serieDetail.results[0];
          let url = AboutPage.API_URL;
          url = url.replace('tv_placeholder', serie_id.id.toString());
          url = url.replace('season_placeholder', serie.season.toString());
          url = url.replace('episode_placeholder', serie.episode.toString());
          let episode_request = this.httpClient.get(url);
          episode_request.subscribe(value => {
            let episode: Episode = <Episode>value;
            episode.series_id = serie_id.id;
            episode.series_name = serie.name;
            console.log(episode);
            if (episode.still_path && serie_id.poster_path) {
              episode.still_path = AboutPage.IMAGE_URL + serie_id.poster_path
            } else {
              episode.still_path = "./assets/imgs/no_poster.png"
            }
            this.data.push(episode)
          })
        });
      }
    });
  }
}
