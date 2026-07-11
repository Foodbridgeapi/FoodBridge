# Script to create 30 Drips Wave standard issues
$repo = "foodbridgeapi/FoodBridge"

# Define issues with appropriate complexity and labels
$issues = @(
    @{
        Title = "Add responsive navigation menu for mobile devices"
        Body = @"
## Context
The current navigation menu is not optimized for mobile devices, making it difficult for users to access key features on smaller screens.

## Scope
Implement a responsive hamburger menu that collapses on mobile devices and expands on desktop.

## Implementation Guidelines
- Modify the navigation component in `src/components/`
- Use CSS media queries or a responsive framework
- Ensure smooth transitions and animations
- Test on various screen sizes (320px, 375px, 768px, 1024px)

## Acceptance Criteria
- [ ] Navigation collapses to hamburger menu on screens < 768px
- [ ] Menu expands/collapses smoothly with animation
- [ ] All navigation links remain accessible on mobile
- [ ] No horizontal scrolling on mobile devices

## Complexity
Medium (150 Points)
"@
        Labels = @("enhancement", "good first issue")
    },
    @{
        Title = "Implement user authentication with Supabase"
        Body = @"
## Context
The application needs secure user authentication to allow users to sign up, log in, and manage their profiles.

## Scope
Integrate Supabase authentication system with email/password and social login options.

## Implementation Guidelines
- Use the existing Supabase client in `src/supabaseClient.js`
- Create authentication context in `src/contexts/`
- Implement login, signup, and logout components
- Add protected route wrapper
- Handle authentication errors gracefully

## Acceptance Criteria
- [ ] Users can sign up with email/password
- [ ] Users can log in with email/password
- [ ] Session persistence across page refreshes
- [ ] Protected routes redirect unauthenticated users
- [ ] Error handling for invalid credentials

## Complexity
High (200 Points)
"@
        Labels = @("enhancement", "good first issue")
    },
    @{
        Title = "Add unit tests for utility functions"
        Body = @"
## Context
The codebase lacks test coverage for utility functions, making it difficult to ensure reliability during refactoring.

## Scope
Write comprehensive unit tests for all utility functions in the project.

## Implementation Guidelines
- Set up a testing framework (Jest or Vitest)
- Identify all utility functions in the codebase
- Write tests for edge cases and error conditions
- Aim for >80% code coverage

## Acceptance Criteria
- [ ] Testing framework configured
- [ ] All utility functions have corresponding test files
- [ ] Tests cover happy path and edge cases
- [ ] CI pipeline runs tests automatically

## Complexity
Medium (150 Points)
"@
        Labels = @("enhancement", "good first issue")
    },
    @{
        Title = "Fix z-index stacking issue on modal overlays"
        Body = @"
## Context
Modal overlays are appearing behind other UI elements, making them partially or fully obscured.

## Scope
Identify and fix z-index conflicts in modal and overlay components.

## Implementation Guidelines
- Review all modal and overlay components
- Establish a consistent z-index scale
- Update CSS to use the new scale
- Test modal visibility across different page states

## Acceptance Criteria
- [ ] Modals always appear above other content
- [ ] Multiple modals stack correctly
- [ ] No z-index conflicts in dev tools
- [ ] Works on all major browsers

## Complexity
Trivial (100 Points)
"@
        Labels = @("bug")
    },
    @{
        Title = "Add loading states for async operations"
        Body = @"
## Context
Users experience unresponsive UI during async operations (API calls, data fetching), leading to poor UX.

## Scope
Implement loading indicators for all async operations throughout the application.

## Implementation Guidelines
- Create reusable loading spinner component
- Add loading states to all async functions
- Use skeleton screens where appropriate
- Ensure loading states are accessible

## Acceptance Criteria
- [ ] Loading spinner component created
- [ ] All API calls show loading state
- [ ] Skeleton screens for data-heavy components
- [ ] Loading states are keyboard accessible
- [ ] Loading states have proper ARIA labels

## Complexity
Medium (150 Points)
"@
        Labels = @("enhancement")
    },
    @{
        Title = "Implement dark mode toggle"
        Body = @"
## Context
Users have requested a dark mode option for better viewing in low-light environments.

## Scope
Add a dark mode toggle that persists user preference across sessions.

## Implementation Guidelines
- Use CSS custom properties for theming
- Create light/dark color palettes
- Add toggle button to navigation
- Store preference in localStorage
- Ensure smooth theme transitions

## Acceptance Criteria
- [ ] Dark/light mode toggle works
- [ ] Theme preference persists on reload
- [ ] All components support both themes
- [ ] Smooth transition between themes
- [ ] System preference respected by default

## Complexity
Medium (150 Points)
"@
        Labels = @("enhancement", "good first issue")
    },
    @{
        Title = "Add error boundary component"
        Body = @"
## Context
Unhandled JavaScript errors cause the entire application to crash, leaving users with a blank screen.

## Scope
Implement React error boundaries to gracefully handle component errors.

## Implementation Guidelines
- Create error boundary component
- Wrap major application sections
- Display user-friendly error messages
- Log errors to monitoring service
- Provide recovery options

## Acceptance Criteria
- [ ] Error boundary component created
- [ ] App sections wrapped with error boundaries
- [ ] Errors display friendly message to users
- [ ] Errors are logged for debugging
- [ ] Users can recover from errors

## Complexity
Medium (150 Points)
"@
        Labels = @("enhancement")
    },
    @{
        Title = "Optimize image loading and compression"
        Body = @"
## Context
Large images are slowing down page load times, affecting user experience and SEO.

## Scope
Implement image optimization including lazy loading, compression, and responsive images.

## Implementation Guidelines
- Add image lazy loading
- Implement responsive image sizes
- Use WebP format where supported
- Add image compression pipeline
- Update image components

## Acceptance Criteria
- [ ] Images lazy load when scrolled into view
- [ ] Responsive images served based on screen size
- [ ] WebP format used with fallbacks
- [ ] Lighthouse image score >90
- [ ] Page load time improved by 30%

## Complexity
Medium (150 Points)
"@
        Labels = @("enhancement")
    },
    @{
        Title = "Add search functionality for food listings"
        Body = @"
## Context
Users need to search and filter food listings to find relevant items quickly.

## Scope
Implement search with filters for food listings (type, location, expiration date).

## Implementation Guidelines
- Create search input component
- Implement filter sidebar
- Add debouncing to search input
- Update API to support search parameters
- Display search results with highlighting

## Acceptance Criteria
- [ ] Search input filters listings in real-time
- [ ] Filters work for type, location, date
- [ ] Search results are highlighted
- [ ] Empty state shows helpful message
- [ ] Search performance is acceptable

## Complexity
High (200 Points)
"@
        Labels = @("enhancement")
    },
    @{
        Title = "Fix typo in welcome message"
        Body = @"
## Context
There is a spelling error in the welcome message on the homepage.

## Scope
Correct the typo in the welcome text.

## Implementation Guidelines
- Locate the welcome message in `src/App.jsx`
- Fix the spelling error
- Verify the change appears correctly

## Acceptance Criteria
- [ ] Typo is corrected
- [ ] Message displays correctly on homepage

## Complexity
Trivial (100 Points)
"@
        Labels = @("bug", "good first issue")
    },
    @{
        Title = "Add keyboard navigation support"
        Body = @"
## Context
The application is not fully accessible via keyboard, making it difficult for keyboard-only users.

## Scope
Implement keyboard navigation for all interactive elements.

## Implementation Guidelines
- Ensure all interactive elements are focusable
- Add proper tab order
- Implement keyboard shortcuts for common actions
- Add focus indicators
- Test with screen readers

## Acceptance Criteria
- [ ] All buttons/links are keyboard accessible
- [ ] Logical tab order throughout app
- [ ] Focus indicators are visible
- [ ] Common actions have keyboard shortcuts
- [ ] Passes accessibility audit

## Complexity
High (200 Points)
"@
        Labels = @("enhancement")
    },
    @{
        Title = "Implement pagination for food listings"
        Body = @"
## Context
Large numbers of food listings cause performance issues and make it difficult for users to browse.

## Scope
Add pagination to food listings with configurable page size.

## Implementation Guidelines
- Create pagination component
- Update API to support pagination parameters
- Add page size selector
- Implement URL-based pagination
- Maintain scroll position on page change

## Acceptance Criteria
- [ ] Pagination controls display correctly
- [ ] Page size can be changed (10, 25, 50, 100)
- [ ] URL updates with page parameter
- [ ] Scroll position maintained on navigation
- [ ] Performance improves with large datasets

## Complexity
Medium (150 Points)
"@
        Labels = @("enhancement")
    },
    @{
        Title = "Add email notification system"
        Body = @"
## Context
Users need to receive notifications about new food listings, expiring items, and updates to their submissions.

## Scope
Implement email notification system using Supabase functions or external service.

## Implementation Guidelines
- Set up email service (SendGrid/Supabase)
- Create notification templates
- Implement notification triggers
- Add user notification preferences
- Handle email delivery failures

## Acceptance Criteria
- [ ] Users receive email for new listings
- [ ] Users receive email for expiring items
- [ ] Users can manage notification preferences
- [ ] Email templates are well-designed
- [ ] Failed deliveries are logged

## Complexity
High (200 Points)
"@
        Labels = @("enhancement")
    },
    @{
        Title = "Create user profile page"
        Body = @"
## Context
Users need a profile page to view and edit their personal information, submissions, and activity history.

## Scope
Build a user profile page with editable fields and activity timeline.

## Implementation Guidelines
- Create profile page component
- Add profile form with validation
- Display user's food submission history
- Add profile picture upload
- Implement profile update API

## Acceptance Criteria
- [ ] Profile page displays user information
- [ ] Users can edit profile fields
- [ ] Profile picture can be uploaded
- [ ] Activity history shows submissions
- [ ] Form validation works correctly

## Complexity
Medium (150 Points)
"@
        Labels = @("enhancement", "good first issue")
    },
    @{
        Title = "Add location-based food discovery"
        Body = @"
## Context
Users want to find food listings near their location for easier pickup.

## Scope
Implement geolocation features to show food listings based on user's location.

## Implementation Guidelines
- Integrate browser geolocation API
- Add location permission handling
- Calculate distances between user and listings
- Sort listings by proximity
- Add location filter

## Acceptance Criteria
- [ ] Users can grant location permission
- [ ] Listings show distance from user
- [ ] Listings sorted by proximity
- [ ] Location filter works correctly
- [ ] Fallback when location denied

## Complexity
High (200 Points)
"@
        Labels = @("enhancement")
    },
    @{
        Title = "Implement food listing expiration alerts"
        Body = @"
## Context
Food listings need expiration tracking to alert users and donors about items approaching expiry.

## Scope
Add expiration tracking and alert system for food listings.

## Implementation Guidelines
- Add expiration date field to listings
- Calculate time remaining until expiry
- Implement expiration status indicators
- Add alerts for approaching expiry
- Auto-archive expired listings

## Acceptance Criteria
- [ ] Expiration date is required for listings
- [ ] Time remaining displays on listings
- [ ] Visual indicators for expiry status
- [ ] Alerts sent before expiry
- [ ] Expired items are archived

## Complexity
Medium (150 Points)
"@
        Labels = @("enhancement")
    },
    @{
        Title = "Add social sharing functionality"
        Body = @"
## Context
Users want to share food listings on social media to increase visibility and donations.

## Scope
Implement social sharing buttons for major platforms (Twitter, Facebook, LinkedIn).

## Implementation Guidelines
- Add social sharing component
- Integrate platform sharing APIs
- Customize share messages per platform
- Add share count display
- Test sharing on each platform

## Acceptance Criteria
- [ ] Share buttons display on listings
- [ ] Sharing works on Twitter, Facebook, LinkedIn
- [ ] Share messages are platform-appropriate
- [ ] Share counts display correctly
- [ ] Open graph tags configured

## Complexity
Medium (150 Points)
"@
        Labels = @("enhancement")
    },
    @{
        Title = "Create admin dashboard"
        Body = @"
## Context
Administrators need a dashboard to manage users, listings, and monitor platform activity.

## Scope
Build an admin dashboard with user management, listing moderation, and analytics.

## Implementation Guidelines
- Create admin layout and navigation
- Implement user management table
- Add listing moderation queue
- Create analytics charts
- Add admin-only route protection

## Acceptance Criteria
- [ ] Admin dashboard accessible to admins
- [ ] Users can be managed (ban/unban)
- [ ] Listings can be approved/rejected
- [ ] Analytics display key metrics
- [ ] Admin routes are protected

## Complexity
High (200 Points)
"@
        Labels = @("enhancement")
    },
    @{
        Title = "Add real-time chat for food coordination"
        Body = @"
## Context
Donors and recipients need a way to communicate about food pickup details and coordination.

## Scope
Implement real-time chat functionality between users.

## Implementation Guidelines
- Integrate Supabase real-time or WebSocket
- Create chat interface component
- Add message persistence
- Implement typing indicators
- Add unread message badges

## Acceptance Criteria
- [ ] Users can send/receive messages
- [ ] Messages appear in real-time
- [ ] Chat history is persisted
- [ ] Typing indicators work
- [ ] Unread message count displays

## Complexity
High (200 Points)
"@
        Labels = @("enhancement")
    },
    @{
        Title = "Implement food category system"
        Body = @"
## Context
Food listings need categorization to help users find specific types of food (produce, dairy, baked goods, etc.).

## Scope
Create a category system with hierarchical structure and filtering.

## Implementation Guidelines
- Define food category hierarchy
- Add category selection to listing form
- Implement category filtering
- Create category navigation
- Add category icons

## Acceptance Criteria
- [ ] Categories are defined in database
- [ ] Users select category when listing
- [ ] Filter by category works
- [ ] Category navigation displays
- [ ] Category icons are appropriate

## Complexity
Medium (150 Points)
"@
        Labels = @("enhancement", "good first issue")
    },
    @{
        Title = "Add food image gallery"
        Body = @"
## Context
Food listings need multiple images to show different angles and details of the items.

## Scope
Implement image gallery with upload, preview, and management features.

## Implementation Guidelines
- Create image upload component
- Add image preview gallery
- Implement image ordering
- Add image deletion
- Store images in Supabase storage

## Acceptance Criteria
- [ ] Multiple images can be uploaded
- [ ] Image gallery displays correctly
- [ ] Images can be reordered
- [ ] Images can be deleted
- [ ] Images stored in cloud storage

## Complexity
Medium (150 Points)
"@
        Labels = @("enhancement")
    },
    @{
        Title = "Create mobile app responsive design"
        Body = @"
## Context
The application needs to be fully responsive and optimized for mobile devices.

## Scope
Audit and improve responsive design across all components and pages.

## Implementation Guidelines
- Audit all components for mobile issues
- Fix touch target sizes
- Improve mobile navigation
- Optimize mobile layouts
- Test on various devices

## Acceptance Criteria
- [ ] All components work on mobile
- [ ] Touch targets are 44px minimum
- [ ] Mobile navigation is intuitive
- [ ] No horizontal scrolling on mobile
- [ ] Passes mobile Lighthouse audit

## Complexity
High (200 Points)
"@
        Labels = @("enhancement")
    },
    @{
        Title = "Add user review and rating system"
        Body = @"
## Context
Users need to rate and review donors/recipients to build trust in the community.

## Scope
Implement a review and rating system for user interactions.

## Implementation Guidelines
- Create rating component (stars)
- Add review text input
- Implement review submission
- Display average ratings
- Add review moderation

## Acceptance Criteria
- [ ] Users can rate 1-5 stars
- [ ] Users can write text reviews
- [ ] Reviews are submitted successfully
- [ ] Average ratings display
- [ ] Inappropriate reviews can be moderated

## Complexity
Medium (150 Points)
"@
        Labels = @("enhancement")
    },
    @{
        Title = "Implement advanced search filters"
        Body = @"
## Context
Basic search is insufficient; users need advanced filters to find specific food items.

## Scope
Add advanced filtering options including dietary restrictions, quantity, and availability.

## Implementation Guidelines
- Create advanced filter panel
- Add dietary restriction filters
- Implement quantity range filter
- Add availability time filter
- Save filter preferences

## Acceptance Criteria
- [ ] Advanced filter panel works
- [ ] Dietary filters (vegan, gluten-free, etc.)
- [ ] Quantity range filter functions
- [ ] Time availability filter works
- [ ] Filter preferences are saved

## Complexity
Medium (150 Points)
"@
        Labels = @("enhancement")
    },
    @{
        Title = "Add bookmark/favorite functionality"
        Body = @"
## Context
Users want to save food listings for later review or quick access.

## Scope
Implement bookmark/favorite system for food listings.

## Implementation Guidelines
- Add bookmark button to listings
- Create bookmarks page
- Implement bookmark persistence
- Add bookmark count display
- Sync bookmarks across devices

## Acceptance Criteria
- [ ] Listings can be bookmarked
- [ ] Bookmarks page displays saved items
- [ ] Bookmarks persist across sessions
- [ ] Bookmark count shows on listings
- [ ] Bookmarks sync across devices

## Complexity
Medium (150 Points)
"@
        Labels = @("enhancement", "good first issue")
    },
    @{
        Title = "Create food donation statistics dashboard"
        Body = @"
## Context
Users and administrators need to see statistics about food donations, impact, and community engagement.

## Scope
Build a statistics dashboard with charts and metrics.

## Implementation Guidelines
- Integrate charting library (Chart.js/Recharts)
- Define key metrics to track
- Create data aggregation queries
- Build dashboard layout
- Add date range filters

## Acceptance Criteria
- [ ] Dashboard displays key metrics
- [ ] Charts visualize data correctly
- [ ] Date range filters work
- [ ] Data updates in real-time
- [ ] Dashboard is performant

## Complexity
High (200 Points)
"@
        Labels = @("enhancement")
    },
    @{
        Title = "Implement multi-language support (i18n)"
        Body = @"
## Context
The application needs to support multiple languages to serve a diverse user base.

## Scope
Add internationalization (i18n) support for at least English and Spanish.

## Implementation Guidelines
- Set up i18n library (react-i18next)
- Create translation files
- Replace hardcoded text with translation keys
- Add language switcher
- Implement RTL support if needed

## Acceptance Criteria
- [ ] English and Spanish supported
- [ ] Language switcher works
- [ ] All text is translatable
- [ ] Date/number formats localized
- [ ] Language preference persists

## Complexity
High (200 Points)
"@
        Labels = @("enhancement")
    },
    @{
        Title = "Add offline support with service workers"
        Body = @"
## Context
Users need to access the app offline or with poor internet connectivity.

## Scope
Implement offline support using service workers and local storage.

## Implementation Guidelines
- Set up service worker
- Cache static assets
- Implement offline page
- Store data locally for offline use
- Sync data when connection restored

## Acceptance Criteria
- [ ] App loads offline
- [ ] Static assets are cached
- [ ] Offline page displays
- [ ] Data can be viewed offline
- [ ] Data syncs when online

## Complexity
High (200 Points)
"@
        Labels = @("enhancement")
    },
    @{
        Title = "Create FAQ and help documentation"
        Body = @"
## Context
Users need documentation to understand how to use the platform effectively.

## Scope
Create comprehensive FAQ and help documentation pages.

## Implementation Guidelines
- Create FAQ page component
- Write common questions and answers
- Add search functionality
- Implement help articles
- Add contact support section

## Acceptance Criteria
- [ ] FAQ page is created
- [ ] Common questions are answered
- [ ] FAQ search works
- [ ] Help articles are informative
- [ ] Contact support section exists

## Complexity
Medium (150 Points)
"@
        Labels = @("documentation", "good first issue")
    },
    @{
        Title = "Add user onboarding flow"
        Body = @"
## Context
New users need guidance on how to use the platform effectively.

## Scope
Create an onboarding flow with tutorials and tips.

## Implementation Guidelines
- Design onboarding flow steps
- Create onboarding components
- Add progress tracking
- Implement skip option
- Store onboarding completion

## Acceptance Criteria
- [ ] Onboarding flow displays for new users
- [ ] Steps are clear and helpful
- [ ] Progress is tracked
- [ ] Users can skip onboarding
- [ ] Completion is remembered

## Complexity
Medium (150 Points)
"@
        Labels = @("enhancement")
    },
    @{
        Title = "Implement food safety guidelines"
        Body = @"
## Context
Users need to understand food safety guidelines when donating or receiving food.

## Scope
Add food safety information and guidelines throughout the application.

## Implementation Guidelines
- Create food safety documentation
- Add safety tips to listing form
- Display safety warnings
- Implement safety checklist
- Link to external resources

## Acceptance Criteria
- [ ] Safety guidelines are documented
- [ ] Tips appear during listing creation
- [ ] Warnings display appropriately
- [ ] Safety checklist is available
- [ ] External resources are linked

## Complexity
Medium (150 Points)
"@
        Labels = @("documentation")
    },
    @{
        Title = "Add report abuse functionality"
        Body = @"
## Context
Users need a way to report inappropriate listings or behavior.

## Scope
Implement a reporting system for abusive content or behavior.

## Implementation Guidelines
- Create report form component
- Add report button to listings
- Implement report submission
- Create admin review queue
- Add report status tracking

## Acceptance Criteria
- [ ] Report button is available
- [ ] Report form submits successfully
- [ ] Reports appear in admin queue
- [ ] Report status is tracked
- [ ] Appropriate action is taken

## Complexity
Medium (150 Points)
"@
        Labels = @("enhancement")
    },
    @{
        Title = "Create API documentation"
        Body = @"
## Context
Developers need API documentation to integrate with the FoodBridge platform.

## Scope
Create comprehensive API documentation using OpenAPI/Swagger.

## Implementation Guidelines
- Document all API endpoints
- Define request/response schemas
- Add authentication examples
- Include error response documentation
- Set up Swagger UI

## Acceptance Criteria
- [ ] All endpoints documented
- [ ] Request/response schemas defined
- [ ] Authentication documented
- [ ] Error responses documented
- [ ] Swagger UI is accessible

## Complexity
Medium (150 Points)
"@
        Labels = @("documentation")
    },
    @{
        Title = "Add performance monitoring"
        Body = @"
## Context
The application needs performance monitoring to identify and fix bottlenecks.

## Scope
Integrate performance monitoring (e.g., Sentry, Lighthouse CI).

## Implementation Guidelines
- Set up monitoring service
- Add performance tracking
- Monitor Core Web Vitals
- Set up alerting
- Create performance dashboard

## Acceptance Criteria
- [ ] Monitoring service integrated
- [ ] Performance metrics tracked
- [ ] Core Web Vitals monitored
- [ ] Alerts configured
- [ ] Performance dashboard accessible

## Complexity
Medium (150 Points)
"@
        Labels = @("enhancement")
    },
    @{
        Title = "Implement data export functionality"
        Body = @"
## Context
Users need to export their data (listings, profile) for backup or analysis.

## Scope
Add data export functionality in multiple formats (CSV, JSON).

## Implementation Guidelines
- Create export component
- Implement CSV export
- Implement JSON export
- Add export scheduling
- Ensure data privacy

## Acceptance Criteria
- [ ] Export button is available
- [ ] CSV export works correctly
- [ ] JSON export works correctly
- [ ] Export can be scheduled
- [ ] Data privacy is maintained

## Complexity
Medium (150 Points)
"@
        Labels = @("enhancement")
    },
    @{
        Title = "Add community guidelines page"
        Body = @"
## Context
The platform needs clear community guidelines to maintain a positive environment.

## Scope
Create a community guidelines page with rules and expectations.

## Implementation Guidelines
- Write community guidelines
- Create guidelines page
- Add to navigation
- Link from relevant areas
- Make guidelines easily accessible

## Acceptance Criteria
- [ ] Guidelines are written clearly
- [ ] Guidelines page is created
- [ ] Page is linked in navigation
- [ ] Guidelines are linked from key areas
- [ ] Page is accessible

## Complexity
Trivial (100 Points)
"@
        Labels = @("documentation", "good first issue")
    }
)

# Create issues
foreach ($issue in $issues) {
    Write-Host "Creating issue: $($issue.Title)"
    
    $labelParams = $issue.Labels | ForEach-Object { "--label", $_ }
    & gh issue create --repo $repo --title $issue.Title --body $issue.Body @labelParams
    
    Start-Sleep -Milliseconds 500
}

Write-Host "Created 30 issues successfully!"
