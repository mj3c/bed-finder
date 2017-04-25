import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { MapPage } from '../map/map';
import { AccommodationsPage } from "../accommodations/accommodations";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = MapPage;
  tab3Root = AccommodationsPage;

  constructor() {

  }
}
