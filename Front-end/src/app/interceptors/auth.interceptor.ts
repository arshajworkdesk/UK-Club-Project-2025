import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * HTTP Interceptor to add JWT token to requests
 * Automatically adds Authorization header for authenticated requests
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  // Public endpoints that don't require JWT token
  // These should match the actual API paths (with /api prefix)
  private readonly publicEndpoints = [
    '/api/login',
    '/api/membership/register',
    '/api/membership/send-otp',
    '/api/membership/verify-otp',
    '/api/membership/resend-otp',
    '/api/members',
    '/api/contact',
    '/api/upload/profile-picture',
    '/api/upload/club-image',
    '/api/upload/club-logo',
    '/api/club-details', // Public - everyone can view club details
    '/api/club-images/', // Public - for serving club images
    '/api/profile-pictures/', // Public - for serving profile pictures
    '/api/club-logos/', // Public - for serving club logos
    '/api/auth/forgot-password',
    '/api/auth/verify-reset-otp',
    '/api/auth/reset-password',
    // Also check without /api prefix for flexibility
    '/login',
    '/membership/register',
    '/membership/send-otp',
    '/membership/verify-otp',
    '/membership/resend-otp',
    '/members',
    '/contact',
    '/upload/profile-picture',
    '/upload/club-image',
    '/upload/club-logo',
    '/club-details',
    '/club-images/',
    '/profile-pictures/',
    '/club-logos/',
    '/auth/forgot-password',
    '/auth/verify-reset-otp',
    '/auth/reset-password'
  ];

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Extract path from URL (handles both relative and absolute URLs)
    let path = request.url;
    try {
      // If it's an absolute URL, extract the pathname
      if (request.url.startsWith('http://') || request.url.startsWith('https://')) {
        const url = new URL(request.url);
        path = url.pathname;
      } else {
        // For relative URLs, use as is
        path = request.url;
      }
    } catch (e) {
      // If URL parsing fails, use the original URL
      path = request.url;
    }
    
    // Special case: /api/admin/* endpoints should always require auth
    // Check this first before checking public endpoints
    const isAdminEndpoint = path.startsWith('/api/admin/');
    
    // Check if this is a public endpoint
    // Use exact match or path starts with for image endpoints
    let isPublicEndpoint = false;
    if (!isAdminEndpoint) {
      isPublicEndpoint = this.publicEndpoints.some(endpoint => {
        // For image endpoints (ending with /), check if path starts with it
        if (endpoint.endsWith('/')) {
          return path.startsWith(endpoint);
        }
        // For exact endpoints, check exact match or ends with
        return path === endpoint || path.endsWith(endpoint);
      });
    }

    // Skip adding token for public endpoints
    if (isPublicEndpoint) {
      return next.handle(request);
    }

    // Get token from auth service - try multiple methods
    let token = this.authService.getToken();
    
    // Fallback: Get token directly from localStorage if service method fails
    if (!token || token.trim() === '') {
      try {
        const directToken = localStorage.getItem('uk_club_token');
        if (directToken && directToken.trim() !== '') {
          token = directToken;
        }
      } catch (e) {
        // Silently handle localStorage access errors
      }
    }

    // If token exists, add it to the request
    if (token && token.trim() !== '') {
      const authHeader = `Bearer ${token.trim()}`;
      const clonedRequest = request.clone({
        setHeaders: {
          Authorization: authHeader
        }
      });
      
      return next.handle(clonedRequest);
    }

    // No token for protected endpoint - let the backend handle the 401 response
    // Don't log errors here as the backend will return appropriate error response
    return next.handle(request);
  }
}

