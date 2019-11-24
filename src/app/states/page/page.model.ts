import { GridsterItem } from "angular-gridster2";

export interface Page extends GridsterItem {
  name?: string;
  id?: string;
  url: string;
  tab: string; //The referenced tab id, there is currently no check that tab exists
}