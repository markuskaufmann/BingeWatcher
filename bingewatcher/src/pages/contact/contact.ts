import {Component, NgZone} from '@angular/core';
import {ItemSliding, NavController} from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import {FavoriteService} from "../../services/favorite/favorite";
import {StoredFavorite} from "../../interfaces/StoredFavorite";
import {SerieDetail} from "../../interfaces/SerieDetail";
import {DetailPage} from "../detail/detail";

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  private static readonly API_DETAIL_URL = "https://api.themoviedb.org/3/tv/";
  private static readonly API_DETAIL_QUERY = "?api_key=a3098e7a0c2ad40520eab2ff867b1f76&language=de";
  private static readonly IMAGE_URL = "http://image.tmdb.org/t/p/w185/";

  username: string;
  favorites: Array<StoredFavorite>;
  detail: SerieDetail;

  constructor(public navCtrl: NavController, public httpClient: HttpClient, private favService: FavoriteService, public zone: NgZone) {
  }

  ionViewWillEnter() {
    this.getData();
  }

  reloadData(refresher) {
    this.getData();
    setTimeout(() => {
      refresher.complete();
    }, 2000)
  }

  getData() {
    this.zone.run(() => {
      let storedData = this.favService.storedData;
      this.username = storedData.username;
      this.favorites = storedData.favs;
      console.log(this.username);
      console.log(this.favorites);
    });
  }

  saveUsername() {
    if(this.username && this.username.trim().length > 0) {
      let name = this.username.trim();
      this.favService.setUsername(name);
    }
  }

  removeFavorite(fav: StoredFavorite, item: ItemSliding) {
    this.favService.removeFavorite(fav);
    item.close();
  }

  updatePush(fav: StoredFavorite) {
    this.favService.setPush(fav, !fav.push);
  }

  showDetails(fav: StoredFavorite) {
    let results = this.httpClient.get(ContactPage.API_DETAIL_URL + fav.serieId + ContactPage.API_DETAIL_QUERY);
    results.subscribe(data => {
      let serieDetail = <SerieDetail> data;
      if (serieDetail.poster_path) {
        serieDetail.poster_path = ContactPage.IMAGE_URL + serieDetail.poster_path
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
}
