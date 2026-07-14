# 🌟 NovaFund - Futuristic Crowdfunding Platform

NovaFund is a futuristic crowdfunding ecosystem enabling Supporters to fuel visionary projects with platform credits, and Creators to withdraw raised funds securely.

🔗 **Live Site URL:** [https://crowdfund-client-kappa.vercel.app](https://crowdfund-client-kappa.vercel.app)

---

## 🔑 Default Credentials for Testing

### 👑 System Administrator (Admin)
- **Email:** `admin@crowdfund.com`
- **Password:** `adminPassword`

### 🎨 Campaign Creator (Creator)
- **Email:** `creator@crowdfund.com`
- **Password:** `creatorPassword`

### 🛡️ Supporter (Backer)
- **Email:** `supporter@crowdfund.com`
- **Password:** `supporterPassword`

---

## 🚀 Key Features

1. **Role-Based Authorization System:** Supports three distinct user roles (Supporter, Creator, Admin) with dedicated interfaces, dashboard layouts, and backend route protection.
2. **Seamless Styling with TailwindCSS v4:** Powered by the new compiler `@tailwindcss/vite` for blazing fast builds and cohesive theme management.
3. **Interactive Hero Carousel:** High-impact landing page slider with dynamic banner messages, smooth slide animations, and chevron controls.
4. **Stripe Credit Purchase Integration:** Supporters can purchase platform credit bundles (e.g. $10, $25, $60, $110) securely via Stripe elements card forms.
5. **Campaign Funding Progress Indicators:** Visual progress bars displaying the percentage of campaigns funded and the exact days remaining until the deadline.
6. **Creator Review Dashboard:** Creators can review pending contribution pledges, approving them to update campaign metrics or rejecting them to auto-refund supporters.
7. **Secure Credits Refund System:** Automatic credit restoration to supporters' balances when campaigns are deleted by the creator.
8. **Admin Approval Console:** Admins review newly launched creator campaigns before they are made public to prevent platform abuse.
9. **Withdrawal Cash-Out System:** Creators can withdraw raised funds to bank accounts or mobile money (20 credits = $1, min withdrawal $10) pending Admin payout confirmation.
10. **Flagged Fraud Report Mechanism:** Supporters can report suspicious campaigns. Reports are directed to the Admin console for dismissal or deletion.
11. **Real-time Notifications Box:** A popup notification list showing role-based system actions (payout approvals, pledge approval, refunds, new campaigns).
12. **Server-Side Pagination:** Integrated pagination for supporter contributions list ensuring high database performance.
13. **Robust Error Recovery:** Features an unhandled React runtime Error Boundary display and a beautiful cosmic 404 page.

---

## 🛠️ Technology Stack
- **Frontend:** React, React Router Dom, Lucide Icons, Stripe SDK, Vite.
- **Backend:** Node.js, Express, MongoDB Atlas, JWT, Stripe API.
- **Styling:** TailwindCSS v4.
