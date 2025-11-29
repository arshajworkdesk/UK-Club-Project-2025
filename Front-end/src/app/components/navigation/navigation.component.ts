import { Component, HostListener, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { APP_CONSTANTS } from '../../constants/app.constants';
import { APP_MESSAGES } from '../../constants/app.messages';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  isMenuOpen = false;
  isScrolled = false;
  isAuthenticated = false;
  isOnDashboard = false;
  showLogoutConfirm = false;
  clubName: string = APP_CONSTANTS.BRAND_NAME;
  clubLogo: string | null = null;

  // Expose constants for template
  readonly APP_CONSTANTS = APP_CONSTANTS;
  readonly APP_MESSAGES = APP_MESSAGES;

  constructor(
    private authService: AuthService,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    // Check authentication status (all authenticated users can see dashboard)
    this.isAuthenticated = this.authService.isAuthenticated();
    
    // Check if currently on dashboard
    this.checkDashboardRoute();
    
    // Subscribe to route changes to update dashboard status
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkDashboardRoute();
      });
    
    // Subscribe to authentication status changes
    this.authService.currentAdmin$.subscribe(() => {
      this.isAuthenticated = this.authService.isAuthenticated();
    });
    
    // Load club name and logo from API
    this.loadClubName();
    
    // Subscribe to club details updates to refresh logo immediately
    this.apiService.clubDetailsUpdated.subscribe((details) => {
      if (details?.clubName) {
        this.clubName = details.clubName;
      }
      if (details?.clubLogo) {
        this.clubLogo = this.apiService.getClubLogoUrl(details.clubLogo) + '?t=' + Date.now();
      } else {
        this.clubLogo = null;
      }
    });
  }

  checkDashboardRoute(): void {
    this.isOnDashboard = this.router.url.includes('/admin/dashboard');
  }

  loadClubName(): void {
    this.apiService.getClubDetails().subscribe({
      next: (details) => {
        if (details?.clubName) {
          this.clubName = details.clubName;
        }
        if (details?.clubLogo) {
          this.clubLogo = this.apiService.getClubLogoUrl(details.clubLogo);
        } else {
          this.clubLogo = null;
        }
      },
      error: (error) => {
        if (error?.status !== 404) {
        console.error('Error loading club name:', error);
        }
        // Keep default BRAND_NAME
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 20;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  logout(): void {
    // Open confirmation modal instead of logging out immediately
    this.showLogoutConfirm = true;
  }

  confirmLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
    this.closeMenu();
    this.showLogoutConfirm = false;
  }

  cancelLogout(): void {
    this.showLogoutConfirm = false;
  }

  getClubLogoAlt(): string {
    return APP_MESSAGES.UI.IMAGE_ALT.CLUB_LOGO_NAV(this.clubName);
  }
}

