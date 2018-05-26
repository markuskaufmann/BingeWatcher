import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Serie} from "../../interfaces/Serie";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  favorites: Array<Serie>;

  constructor(public navCtrl: NavController, public httpClient: HttpClient) {
    this.getFavorites();
  }

  getFavorites() {
    // let storedFavorites = this.favService.storedFavorites;
    /*for(let storedFavorite of storedFavorites.favs) {
      /!*let results = this.httpClient.get(SearchPage.API_URL + query);
      results.subscribe(data => {
        console.log(data);
        let searchResults: SearchResults = <SearchResults> data;
        this.results = searchResults.results;
        for(let serie of this.results) {
          if (serie.poster_path) {
            serie.poster_path = SearchPage.IMAGE_URL + serie.poster_path
          } else  {
            serie.poster_path = "./assets/imgs/no_poster.png"
          }
        }
      });*!/
    }*/
  }
}
