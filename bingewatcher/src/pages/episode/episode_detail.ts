import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {Episode} from "../../interfaces/Episode";

@Component({
  selector: 'page-episode_detail',
  templateUrl: 'episode_detail.html'
})
export class EpisodeDetailPage {

  episodeDetail: Episode;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.episodeDetail = <Episode> this.navParams.get("episode");
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
}
