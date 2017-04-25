import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { Map } from '../map/map';
import { Accommodations } from "../accommodations/accommodations";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = Map;
  tab3Root = Accommodations;

  constructor() {

  }
}
