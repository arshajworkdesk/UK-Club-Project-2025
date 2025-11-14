import { trigger, transition, style, query, animateChild, group, animate, stagger } from '@angular/animations';

/**
 * Route transition animations
 * Subtle fade and slide effects for route changes
 */
export const routeAnimations = trigger('routeAnimations', [
  transition('* <=> *', [
    // Set default styles for entering and leaving
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ], { optional: true }),
    
    // Animate leaving component
    query(':leave', [
      animate('200ms ease-out', style({ opacity: 0, transform: 'translateY(10px)' }))
    ], { optional: true }),
    
    // Animate entering component
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(-10px)' }),
      animate('300ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
    ], { optional: true }),
    
    // Animate child components
    query(':enter', animateChild(), { optional: true })
  ])
]);

/**
 * Fade in animation for page content
 */
export const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms ease-in', style({ opacity: 1 }))
  ])
]);

/**
 * Slide in from bottom animation
 */
export const slideInUp = trigger('slideInUp', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(20px)' }),
    animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ])
]);

/**
 * Stagger animation for list items
 */
export const staggerList = trigger('staggerList', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(10px)' }),
      stagger(50, [
        animate('250ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ], { optional: true })
  ])
]);

