import {Serie} from "./Serie";
import {Season} from "./Season";
import {Regisseur} from "./Regisseur";
import {Genre} from "./Genre";
import {Network} from "./Network";

export interface SerieDetail extends Serie {
  last_air_date: string;
  episode_run_time: number[];
  homepage: string;
  in_production: boolean;
  number_of_episodes: number;
  number_of_seasons: number;
  type: string;
  status: string;
  seasons: Season[];
  created_by: Regisseur[];
  genres: Genre[];
  networks: Network[];
  languages: string[];
}
