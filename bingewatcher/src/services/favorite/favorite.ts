import { Injectable } from '@angular/core';
import {StoredData} from "../../interfaces/StoredData";
import {Serie} from "../../interfaces/Serie";
import {File} from "@ionic-native/file";
import {HttpClient} from "@angular/common/http";
import {StoredFavorite} from "../../interfaces/StoredFavorite";

@Injectable()
export class FavoriteService {

  private static readonly FILE_NAME = "storedFavorites.json";
  private static readonly IMAGE_URL = "http://image.tmdb.org/t/p/w185/";

  public storedData: StoredData;

  constructor(private file: File, private httpClient: HttpClient) {
    this.read();
  }

  public setUsername(username: string) {
    this.storedData.username = username;
    this.persist();
  }

  public addOrSetFavorite(serie: Serie, push: boolean) {
    for(let fav of this.storedData.favs) {
      if(fav.serieId === serie.id) {
        fav.push = push;
        return;
      }
    }
    this.storedData.favs.push({ serieId: serie.id, name: serie.name,
                                first_air_date: serie.first_air_date,
                                poster_path: serie.poster_path, push: push });
    this.sortFavorites();
    this.persist();
  }

  public removeFavorite(serie: StoredFavorite) {
    let index = -1;
    for(let fav of this.storedData.favs) {
      if(fav.serieId === serie.serieId) {
        index = this.storedData.favs.indexOf(fav);
        break;
      }
    }
    if(index > -1) {
      this.storedData.favs.splice(index, 1)
    }
    this.persist();
  }

  public checkIfInFavorites(serieId: number): boolean {
    for(let storedFavorite of this.storedData.favs) {
      if(storedFavorite.serieId === serieId) {
        return true;
      }
    }
    return false;
  }

  public persist() {
    let data = JSON.stringify(this.storedData);
    let write = this.file.writeFile(this.file.dataDirectory, FavoriteService.FILE_NAME, data, { replace: true });
    write.then((success) => { console.log("file saved"); }, (error) => { console.log("write failed"); });
  }

  public read() {
    this.readPlaceholders();
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
          this.storedData = <StoredData> data;
          this.sortFavorites();
        }
      });
    }, (error) => { console.log("read failed"); });
  }

  private readPlaceholders() {
    this.storedData = {
      username: "Test",
      favs: [{ serieId: 62710, name: "Blindspot", first_air_date: "2015-09-21",
        poster_path: FavoriteService.IMAGE_URL + "/fx3SId5m3j77BOM4YJ0veJwsraq.jpg", push: true },
        { serieId: 41727, name: "Banshee", first_air_date: "2013-01-11",
          poster_path: FavoriteService.IMAGE_URL + "/fvocBFChMERoxWb7MMuTsUqWEis.jpg", push: false }]
    };
    this.sortFavorites();
  }

  private sortFavorites() {
    this.storedData.favs.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  }
}
