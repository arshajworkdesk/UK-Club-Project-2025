import { Component, OnInit } from '@angular/core';
import { ApiService, Member } from '../../services/api.service';
import { fadeIn, staggerList } from '../../animations/route.animations';

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

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(): void {
    this.isLoading = true;
    // Get only approved members
    this.apiService.getApprovedMembers().subscribe({
      next: (members) => {
        // Filter to show only approved members
        this.members = members.filter(m => m.approvalStatus === 'Approved');
        this.filteredMembers = [...this.members];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading members:', error);
        // Mock data for development
        this.members = this.getMockMembers();
        this.filteredMembers = [...this.members];
        this.isLoading = false;
      }
    });
  }

  getMockMembers(): Member[] {
    return [
      { id: 1, fullName: 'John Smith', email: 'john.smith@example.com', dob: '1990-05-15', gender: 'male', approvalStatus: 'Approved' as const, role: 'member' as const },
      { id: 2, fullName: 'Sarah Johnson', email: 'sarah.j@example.com', dob: '1992-08-20', gender: 'female', approvalStatus: 'Approved' as const, role: 'member' as const },
      { id: 3, fullName: 'Michael Brown', email: 'm.brown@example.com', dob: '1988-03-10', gender: 'male', approvalStatus: 'Approved' as const, role: 'member' as const },
      { id: 4, fullName: 'Emily Davis', email: 'emily.d@example.com', dob: '1995-11-05', gender: 'female', approvalStatus: 'Approved' as const, role: 'member' as const },
      { id: 5, fullName: 'David Wilson', email: 'd.wilson@example.com', dob: '1991-07-12', gender: 'male', approvalStatus: 'Approved' as const, role: 'member' as const }
    ];
  }

  onSearchChange(): void {
    if (!this.searchTerm.trim()) {
      this.filteredMembers = [...this.members];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredMembers = this.members.filter(member =>
      member.fullName.toLowerCase().includes(term) ||
      member.email.toLowerCase().includes(term)
    );
  }

  onSortChange(): void {
    this.filteredMembers = [...this.filteredMembers].sort((a, b) => {
      return a.fullName.localeCompare(b.fullName);
    });
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  formatGender(gender?: string): string {
    if (!gender) return 'N/A';
    const genderMap: { [key: string]: string } = {
      'male': 'Male',
      'female': 'Female',
      'other': 'Other',
      'prefer-not-to-say': 'Prefer not to say'
    };
    return genderMap[gender] || gender;
  }
}

