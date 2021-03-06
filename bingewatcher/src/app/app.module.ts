import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {HttpClientModule} from "@angular/common/http";
import { File } from "@ionic-native/file";
import {SearchPage} from "../pages/search/search";
import {FavoriteService} from "../services/favorite/favorite";
import {DetailPage} from "../pages/detail/detail";
import {EpisodeDetailPage} from "../pages/episode/episode_detail";
import {Toast} from "@ionic-native/toast";

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    SearchPage,
    ContactPage,
    DetailPage,
    EpisodeDetailPage,
    HomePage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    SearchPage,
    ContactPage,
    DetailPage,
    EpisodeDetailPage,
    HomePage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    Toast,
    FavoriteService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
