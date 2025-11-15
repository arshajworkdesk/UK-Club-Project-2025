import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ThemeService } from './services/theme.service';
import { RouterOutlet } from '@angular/router';
import { fadeIn } from './animations/route.animations';
import { APP_CONSTANTS } from './constants/app.constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeIn]
})
export class AppComponent implements OnInit {
  title = APP_CONSTANTS.BRAND_NAME;

  constructor(
    private themeService: ThemeService,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    // Set page title from constants
    this.titleService.setTitle(APP_CONSTANTS.APP_TITLE);
    // Dark theme is automatically applied via ThemeService
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}

