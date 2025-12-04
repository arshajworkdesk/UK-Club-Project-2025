import { Component, OnInit } from '@angular/core';
import { ApiService, Member } from '../../services/api.service';
import { fadeIn, staggerList } from '../../animations/route.animations';
import { APP_CONSTANTS } from '../../constants/app.constants';
import { APP_MESSAGES } from '../../constants/app.messages';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
  animations: [fadeIn, staggerList]
})
export class MembersComponent implements OnInit {
  members: Member[] = [];
  filteredMembers: Member[] = [];
  isLoading = true;
  searchTerm = '';
  sortBy: 'name' = 'name';
  clubName: string = APP_CONSTANTS.BRAND_NAME;

  // Expose constants for template
  readonly APP_CONSTANTS = APP_CONSTANTS;
  readonly APP_MESSAGES = APP_MESSAGES;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadMembers();
    this.loadClubName();
  }

  loadClubName(): void {
    this.apiService.getClubDetails().subscribe({
      next: (details) => {
        if (details?.clubName) {
          this.clubName = details.clubName;
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

  loadMembers(): void {
    this.isLoading = true;
    // Get only approved members
    this.apiService.getApprovedMembers().subscribe({
      next: (members) => {
        // Backend already returns only approved members, but filter to be safe
        this.members = members.filter(m => m.approvalStatus === 'Approved');
        this.filteredMembers = [...this.members];
        // Apply initial sort
        this.applySort();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading members:', error);
        this.members = [];
        this.filteredMembers = [];
        this.isLoading = false;
      }
    });
  }

  onSearchChange(): void {
    if (!this.searchTerm.trim()) {
      this.filteredMembers = [...this.members];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredMembers = this.members.filter(member =>
        member.fullName.toLowerCase().includes(term)
      );
    }
    // Apply current sort after filtering
    this.applySort();
  }

  private applySort(): void {
    this.filteredMembers = [...this.filteredMembers].sort((a, b) => {
      // Sort by name
      return a.fullName.localeCompare(b.fullName);
    });
  }

  onSortChange(): void {
    this.applySort();
  }

  setSort(sort: 'name'): void {
    if (this.sortBy !== sort) {
      this.sortBy = sort;
      this.applySort();
    }
  }

  resetMemberFilters(): void {
    this.searchTerm = '';
    this.sortBy = 'name';
    this.filteredMembers = [...this.members];
    this.applySort();
  }

  onImageError(event: Event): void {
    // Hide the image if it fails to load, fallback to initial will show
    const img = event.target as HTMLImageElement;
    const src = img.src;
    
    // If image failed to load and URL contains :8082, try converting to gateway URL
    if (src && src.includes(':8082')) {
      const gatewayUrl = src.replace(':8082', ':8080');
      img.src = gatewayUrl;
      return; // Try loading with gateway URL
    }
    
    img.style.display = 'none';
  }
  
  /**
   * Get profile picture URL using API service
   * If it's already a full URL, return as is
   * Otherwise, use API service to construct URL from path (backend should normally return full Supabase URLs)
   */
  getImageUrl(url: string | undefined): string | undefined {
    if (!url) return url;
    // If it's already a full Supabase Storage URL, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // Otherwise, use API service to construct URL from path (backend should normally return full Supabase URLs)
    return this.apiService.getProfilePictureUrl(url);
  }

  formatRole(role?: string): string {
    if (!role) return 'Member';
    const roleMap: { [key: string]: string } = {
      'admin': 'Admin',
      'manager': 'Manager',
      'member': 'Member'
    };
    return roleMap[role.toLowerCase()] || role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
  }

  getShowingMembersMessage(): string {
    return APP_MESSAGES.UI.SHOWING_MEMBERS(this.filteredMembers.length, this.members.length);
  }

  getMembersSubtitle(): string {
    return APP_MESSAGES.UI.MEMBERS_SUBTITLE(this.clubName);
  }

  getProfilePictureAlt(name: string): string {
    return APP_MESSAGES.UI.IMAGE_ALT.PROFILE_PICTURE(name);
  }
}

