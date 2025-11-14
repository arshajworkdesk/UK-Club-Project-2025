import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  clubStats = {
    totalMembers: 0,
    activeEvents: 0,
    yearsEstablished: 0
  };

  features = [
    {
      icon: '👥',
      title: 'Growing Community',
      description: 'Join hundreds of members in our vibrant community'
    },
    {
      icon: '🎯',
      title: 'Exclusive Events',
      description: 'Access to premium events and networking opportunities'
    },
    {
      icon: '🌟',
      title: 'Premium Benefits',
      description: 'Enjoy exclusive perks and member-only privileges'
    }
  ];

  ngOnInit(): void {
    // TODO: Fetch actual stats from API
    this.clubStats = {
      totalMembers: 1250,
      activeEvents: 12,
      yearsEstablished: 5
    };
  }

  getStatsArray(): Array<{key: string, value: number}> {
    return [
      { key: 'Total Members', value: this.clubStats.totalMembers },
      { key: 'Active Events', value: this.clubStats.activeEvents },
      { key: 'Years Established', value: this.clubStats.yearsEstablished }
    ];
  }
}

