import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  favorites = [];

  constructor(public navCtrl: NavController) {
    this.favorites.push("Blacklist", "Banshee", "Westworld", "Game of Thrones", "Blindspot")
  }

}
