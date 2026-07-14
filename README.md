# NovaFund Client Application

This is the React frontend client for NovaFund, built using Vite, styled with Vanilla CSS, and authenticated with Firebase + JWT.

## 📁 Source Code Structure

### `src/components`
- `Navbar.jsx` - Top responsive navigation header (shows logo, explore campaigns, join as developer, credit balance, user avatar with options, and login/register buttons).
- `Footer.jsx` - Bottom footer mapping links to explore tabs and social profiles.
- `CampaignCard.jsx` - Card rendering cover image, category badge, title, story, progress bar, raised vs goal credits, days left, and details navigation link.

### `src/layouts`
- `MainLayout.jsx` - Standard landing wrapper.
- `DashboardLayout.jsx` - Responsive Dashboard frame (contains user card, credits pill, vertical sidebar menu, and click-outside-closable notification pop-up widget).

### `src/pages`
- `Home.jsx` - Landing page with animated hero carousel slider, statistics counter cards, static Swiper-styled testimonials, and browse-by-category links.
- `Explore.jsx` - Search, filter, and sort grid layout.
- `CampaignDetails.jsx` - Full pitch story page with credit pledge inputs and modal abuse report form.
- `Login.jsx` & `Register.jsx` - Credentials authentication with error handling.

### `src/pages/dashboard`
- `SupporterHome.jsx` - Supporter consoles displaying approved pledges.
- `CreatorHome.jsx` - Creator panels displaying launched stats and checklist of pending pledges.
- `AdminHome.jsx` - Global system status widgets.
- `MyContributions.jsx` - Supporter pledges list with server-side pagination.
- `PurchaseCredit.jsx` - Stripe Elements card form pack selector.
- `PaymentHistory.jsx` - Unified cash log.
- `Reports.jsx` - Unified fraud flags resolver.
- `AddCampaign.jsx` - Campaign creation form with imgBB upload integration.
- `MyCampaigns.jsx` - Creator campaign list with update and delete/refund hooks.
- `ManageUsers.jsx` - Admin member console.
- `ManageCampaigns.jsx` - Admin approvals listing.
- `WithdrawalRequests.jsx` - Admin payout checker.

### `src/providers`
- `AuthProvider.jsx` - Context manager for login/session persistence.

### `src/routes`
- `PrivateRoute.jsx` - Route restriction wrapper.
- `RoleRoute.jsx` - Route clearance guard.
