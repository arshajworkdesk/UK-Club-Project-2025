import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ThemeService } from './services/theme.service';
import { ApiService } from './services/api.service';
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
  title: string = APP_CONSTANTS.BRAND_NAME;

  constructor(
    private themeService: ThemeService,
    private titleService: Title,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    // Set initial page title from constants
    this.titleService.setTitle(APP_CONSTANTS.APP_TITLE);
    // Dark theme is automatically applied via ThemeService
    
    // Don't set default favicon - only show if club logo is uploaded
    this.removeFavicon();
    
    // Load club name from API and update title dynamically
    this.loadClubNameAndUpdateTitle();
    
    // Subscribe to club details updates to refresh favicon immediately
    this.apiService.clubDetailsUpdated.subscribe((details) => {
      if (details?.clubLogo) {
        this.updateFavicon(details.clubLogo);
      } else {
        this.removeFavicon();
      }
    });
  }

  /**
   * Remove all favicon links from the document head
   */
  removeFavicon(): void {
    try {
      // Remove existing favicon links
      const existingLinks = document.querySelectorAll("link[rel*='icon']");
      existingLinks.forEach(link => {
        document.head.removeChild(link);
      });
    } catch (error) {
      console.error('Error removing favicon:', error);
    }
  }

  loadClubNameAndUpdateTitle(): void {
    this.apiService.getClubDetails().subscribe({
      next: (details) => {
        if (details?.clubName) {
          // Update the base title with dynamic club name
          const baseTitle = APP_CONSTANTS.APP_TITLE.replace(APP_CONSTANTS.BRAND_NAME, details.clubName);
          this.titleService.setTitle(baseTitle);
          this.title = details.clubName; // Update component title property too
        }
        
        // Update favicon with club logo if available (fallback to default if not)
        this.updateFavicon(details?.clubLogo);
      },
      error: (error) => {
        if (error?.status !== 404) {
          console.error('Error loading club name for title:', error);
        }
        // Keep default title from constants
      }
    });
  }

  /**
   * Update the browser favicon with club logo from database
   * Removes favicon if club logo is not available
   * @param clubLogoFilename The filename of the club logo stored in database
   */
  updateFavicon(clubLogoFilename: string | null | undefined): void {
    try {
      // Remove existing favicon links
      const existingLinks = document.querySelectorAll("link[rel*='icon']");
      existingLinks.forEach(link => {
        document.head.removeChild(link);
      });

      // Only set favicon if club logo is provided
      if (clubLogoFilename) {
        // Use club logo from database (with cache busting)
        const faviconUrl = this.apiService.getClubLogoUrl(clubLogoFilename) + '?t=' + Date.now();
        const faviconType = 'image/jpeg';

        // Create new favicon link
        const link = document.createElement('link');
        link.rel = 'icon';
        link.type = faviconType;
        link.href = faviconUrl;
        
        // Add error handler to remove favicon if logo fails to load
        link.onerror = () => {
          // If club logo fails to load, remove favicon
          this.removeFavicon();
        };
        
        // Add to head
        document.head.appendChild(link);
      } else {
        // No club logo, ensure favicon is removed
        this.removeFavicon();
      }
    } catch (error) {
      console.error('Error updating favicon:', error);
      // Remove favicon on error
      this.removeFavicon();
    }
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}

