import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { Map } from '../map/map';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = Map;

  constructor() {

  }
}
