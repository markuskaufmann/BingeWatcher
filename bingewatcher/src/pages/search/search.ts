import { Component } from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import {SearchResults} from "../../interfaces/SearchResults";
import {Serie} from "../../interfaces/Serie";
import {DetailPage} from "../detail/detail";
import {SerieDetail} from "../../interfaces/SerieDetail";
import {FavoriteService} from "../../services/favorite/favorite";
import {Toast} from "@ionic-native/toast";

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  private static readonly API_URL = "https://api.themoviedb.org/3/search/tv?api_key=a3098e7a0c2ad40520eab2ff867b1f76&language=de&query=";
  private static readonly API_DETAIL_URL = "https://api.themoviedb.org/3/tv/";
  private static readonly API_DETAIL_QUERY = "?api_key=a3098e7a0c2ad40520eab2ff867b1f76&language=de";
  private static readonly IMAGE_URL = "http://image.tmdb.org/t/p/w185/";

  searchQuery: string;
  results: Array<Serie>;
  detail: SerieDetail;

  constructor(public navCtrl: NavController, public httpClient: HttpClient, public alertCtrl: AlertController,
              public favService: FavoriteService, private toast: Toast) {
  }

  execSearch() {
    if(this.searchQuery && this.searchQuery.trim().length > 0) {
      let query = this.searchQuery.trim();
      let results = this.httpClient.get(SearchPage.API_URL + query);
      results.subscribe(data => {
        console.log(data);
        let searchResults: SearchResults = <SearchResults> data;
        if (searchResults.results.length == 0) {
          this.presentAlert();
          return;
        }
        this.results = searchResults.results;
        for(let serie of this.results) {
          if (serie.poster_path) {
            serie.poster_path = SearchPage.IMAGE_URL + serie.poster_path
          } else  {
            serie.poster_path = "./assets/imgs/no_poster.png"
          }
        }
      });
    }
  }

  showDetail(result: Serie) {
    console.log(result);
    let results = this.httpClient.get(SearchPage.API_DETAIL_URL + result.id + SearchPage.API_DETAIL_QUERY);
    results.subscribe(data => {
      let serieDetail = <SerieDetail> data;
      if (serieDetail.poster_path) {
        serieDetail.poster_path = SearchPage.IMAGE_URL + serieDetail.poster_path
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

  addToFavorites(serie: Serie) {
    this.favService.addOrSetFavorite(serie, false);
    this.toast.show('Zu Favoriten hinzugefügt.', '1500', 'bottom').subscribe(
      toast => {
        console.log('Success', toast);
      },
      error => {
        console.log('Error', error);
      },
      () => {
        console.log('Completed');
      }
    );
  }

  private presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Oops...',
      message: 'No series found.',
      buttons: ['Try again...']
    });
    alert.present();
  }
}
