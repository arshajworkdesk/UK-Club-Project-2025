import { Component, OnInit } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { RouterOutlet } from '@angular/router';
import { fadeIn } from './animations/route.animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fadeIn]
})
export class AppComponent implements OnInit {
  title = 'UK Sports Club';

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Dark theme is automatically applied via ThemeService
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}

