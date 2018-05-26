import { Injectable } from '@angular/core';
import {StoredFavorites} from "../../interfaces/StoredFavorites";
import {Serie} from "../../interfaces/Serie";
import {File} from "@ionic-native/file";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class FavoriteService {

  private static readonly FILE_NAME = "storedFavorites.json";

  public storedFavorites: StoredFavorites;

  constructor(private file: File, private httpClient: HttpClient) {
    this.read();
  }

  public addOrSetFavorite(serie: Serie, push: boolean) {
    for(let fav of this.storedFavorites.favs) {
      if(fav.serieId === serie.id) {
        fav.push = push;
        return;
      }
    }
    this.storedFavorites.favs.push({ serieId: serie.id, push: push });
  }

  public removeFavorite(serie: Serie) {
    let index = -1;
    for(let fav of this.storedFavorites.favs) {
      if(fav.serieId === serie.id) {
        index = this.storedFavorites.favs.indexOf(fav);
        break;
      }
    }
    if(index > -1) {
      this.storedFavorites.favs.splice(index, 1)
    }
  }

  public persist() {
    let data = JSON.stringify(this.storedFavorites);
    let write = this.file.writeFile(this.file.dataDirectory, FavoriteService.FILE_NAME, data, { replace: true });
    write.then((success) => { console.log("file saved"); }, (error) => { console.log("write failed"); });
  }

  public read() {
    let existing = this.file.checkFile(this.file.dataDirectory, FavoriteService.FILE_NAME);
    existing.then((exists) => {
      if(!exists) {
        let create = this.file.createFile(this.file.dataDirectory, FavoriteService.FILE_NAME, true);
        create.then((entry) => { console.log("file created"); }, (error) => { console.log("create failed"); })
      }
    }, (error) => { console.log("check exists failed"); });
    let read = this.file.readAsDataURL(this.file.dataDirectory, FavoriteService.FILE_NAME);
    read.then((url) => {
      let results = this.httpClient.get(url);
      results.subscribe(data => {
        console.log(data);
        if(data) {
          this.storedFavorites = <StoredFavorites> data;
        }
      });
    }, (error) => { console.log("read failed"); });
  }
}
