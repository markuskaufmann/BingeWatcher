import {StoredFavorite} from "./StoredFavorite";

export interface StoredData {
  username: string;
  favs: Array<StoredFavorite>;
}
