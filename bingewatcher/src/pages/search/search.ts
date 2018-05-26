import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {HttpClient} from "@angular/common/http";
import {SearchResults} from "../../interfaces/SearchResults";
import {Serie} from "../../interfaces/Serie";

@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {

  private static readonly API_URL = "https://api.themoviedb.org/3/search/tv?api_key=a3098e7a0c2ad40520eab2ff867b1f76&language=de&query=";
  private static readonly IMAGE_URL = "http://image.tmdb.org/t/p/w185/";

  searchQuery: string;
  results: Array<Serie>;

  constructor(public navCtrl: NavController, public httpClient: HttpClient) {
  }

  execSearch() {
    if(this.searchQuery && this.searchQuery.trim().length > 0) {
      let query = this.searchQuery.trim();
      let results = this.httpClient.get(SearchPage.API_URL + query);
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
      });
    }
  }
}
