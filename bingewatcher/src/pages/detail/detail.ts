import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {SerieDetail} from "../../interfaces/SerieDetail";
import {FavoriteService} from "../../services/favorite/favorite";

@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html'
})
export class DetailPage {

  private static readonly IMAGE_URL = "http://image.tmdb.org/t/p/w185/";

  serieDetail: SerieDetail;

  constructor(public navCtrl: NavController, public navParams: NavParams, public favService: FavoriteService) {
    this.serieDetail = <SerieDetail> this.navParams.get("serie");
  }

  getRegisseur(): string {
    let names = [];
    this.serieDetail.created_by.forEach((value, index, array) => {
      names.push(value.name);
    });
    return names.join(", ");
  }

  getGenre(): string {
    let genres = [];
    this.serieDetail.genres.forEach((value, index, array) => {
      genres.push(value.name);
    });
    return genres.join(", ");
  }

  getNetwork(): string {
    let networks = [];
    this.serieDetail.networks.forEach((value, index, array) => {
      networks.push(value.name);
    });
    return networks.join(", ");
  }

  getSeasonPosterPath(path: string): string {
    if(path) {
      return DetailPage.IMAGE_URL + path;
    } else {
      return "./assets/imgs/no_poster_detail.png"
    }
  }

  transformDate(date: string): string {
    if(date) {
      let year = date.substr(0, 4);
      let month = date.substr(5, 2);
      let day = date.substr(8, 2);
      return day + "." + month + "." + year;
    }
    return "Kein Datum angegeben";
  }

  addToFavorites() {
    this.favService.addOrSetFavorite(this.serieDetail, false);
  }
}
