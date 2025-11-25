import { Component, OnInit } from '@angular/core';
import { APP_CONSTANTS } from '../../constants/app.constants';
import { APP_MESSAGES } from '../../constants/app.messages';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  clubStats = {
    totalMembers: 0,
    yearsEstablished: 0
  };

  clubDetails: any = {
    clubName: APP_CONSTANTS.BRAND_NAME,
    establishedYear: APP_CONSTANTS.DEFAULTS.ESTABLISHED_YEAR,
    description: '',
    clubImage: null
  };
  isLoadingClubDetails = true;

  features = APP_MESSAGES.UI.HOME_FEATURES;

  // Expose constants for template
  readonly APP_CONSTANTS = APP_CONSTANTS;
  readonly APP_MESSAGES = APP_MESSAGES;
  
  // Current year for copyright
  currentYear = new Date().getFullYear();

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadClubDetails();
    this.loadStats();
  }
  
  loadClubDetails(): void {
    this.isLoadingClubDetails = true;
    this.apiService.getClubDetails().subscribe({
      next: (details) => {
        this.clubDetails = {
          clubName: details.clubName || APP_CONSTANTS.BRAND_NAME,
          establishedYear: details.establishedYear || 2020,
          description: details.description || '',
          clubImage: details.clubImage || null
        };
        this.isLoadingClubDetails = false;
        // Update yearsEstablished based on established year
        if (details.establishedYear) {
          const currentYear = new Date().getFullYear();
          this.clubStats.yearsEstablished = currentYear - details.establishedYear;
        }
      },
      error: (error) => {
        console.error('Error loading club details:', error);
        // Use default values if API fails
        this.clubDetails = {
          clubName: APP_CONSTANTS.BRAND_NAME,
          establishedYear: 2020,
          description: `${APP_CONSTANTS.BRAND_NAME} is a prestigious community organization dedicated to bringing together like-minded individuals from across the United Kingdom. Since our establishment, we have been committed to fostering connections, organizing exclusive events, and providing our members with unparalleled opportunities for growth and networking. Our mission is to create a vibrant ecosystem where members can thrive, share experiences, and build lasting relationships. Whether you're looking to expand your professional network, participate in exciting events, or simply be part of an exclusive community, ${APP_CONSTANTS.BRAND_NAME} is the place for you.`
        };
        this.clubStats.yearsEstablished = 5;
        this.isLoadingClubDetails = false;
      }
    });
  }
  
  loadStats(): void {
    // Fetch total members count
    this.apiService.getApprovedMembers().subscribe({
      next: (members) => {
        this.clubStats.totalMembers = members.length;
      },
      error: (error) => {
        console.error('Error loading members for stats:', error);
        this.clubStats.totalMembers = 0;
      }
    });
  }

  getStatsArray(): Array<{key: string, value: number}> {
    return [
      { key: 'Total Members', value: this.clubStats.totalMembers },
      { key: 'Years Established', value: this.clubStats.yearsEstablished }
    ];
  }

  /**
   * Get club image URL using API service
   * @param imageNameOrUrl The filename, Cloudinary public ID, or full URL stored in database
   * @returns Full URL to access the club image
   */
  getClubImageUrl(imageNameOrUrl: string | null | undefined): string | null {
    if (!imageNameOrUrl) return null;
    // If it's already a full URL (Cloudinary), return as-is
    if (imageNameOrUrl.startsWith('http://') || imageNameOrUrl.startsWith('https://')) {
      return imageNameOrUrl;
    }
    // Otherwise, use API service to construct URL (for backward compatibility)
    return this.apiService.getClubImageUrl(imageNameOrUrl);
  }

  /**
   * Handle club image loading error
   * @param event Error event from image element
   */
  onClubImageError(event: Event): void {
    console.error('Error loading club image:', event);
    const img = event.target as HTMLImageElement;
    // If the image fails to load, set clubImage to null to show placeholder
    this.clubDetails.clubImage = null;
  }
}

