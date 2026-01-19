# Trail Tuned

A mountain bike suspension tracking app that allows riders to save and manage their fork and shock settings for different bikes and riding conditions.

## Features

- **Bike Management**: Add, edit, and delete bikes with brand, model, year, and frame details
- **Suspension Setup Tracking**: Save multiple suspension configurations per bike with detailed fork and shock settings
- **Dynamic Component Selection**: Pre-populated database of 200+ suspension components from Fox, RockShox, Ohlins, and Cane Creek with accurate adjustment options
- **Smart Form Fields**: Only shows relevant adjustments based on the selected component (HSC, LSC, HSR, LSR, compression, rebound, air pressure, volume spacers, spring rate, ramp chamber, etc.)
- **User Authentication**: Secure login and signup with email verification via Supabase Auth
- **Responsive Design**: Glassmorphism UI with dark theme optimized for desktop and mobile

## Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + Authentication)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom glassmorphism design
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd trail-tuned
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/dashboard
   ```

   You can find these values in your Supabase project dashboard under **Settings → API**.

4. **Set up the database**

   Run the following SQL scripts in your Supabase SQL Editor (in order):

   - `scripts/001_create_tables.sql` - Creates bikes and suspension_setups tables with RLS policies
   - `scripts/008_add_missing_setup_columns.sql` - Adds component tracking columns
   - `scripts/009_comprehensive_all_brands.sql` - Populates suspension components database

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open the app**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

### Tables

- **bikes**: Stores user bikes (brand, model, year, frame size, wheel size, notes)
- **suspension_setups**: Stores suspension configurations linked to bikes
- **suspension_components**: Pre-populated catalog of fork and shock components with available adjustments

### Row Level Security (RLS)

All tables are protected with RLS policies ensuring users can only access their own data.

## Usage

1. **Create an account** at `/auth/sign-up` and verify your email
2. **Log in** at `/auth/login`
3. **Add a bike** from the dashboard by clicking "Add New Bike"
4. **Create a suspension setup** by navigating to your bike and clicking "Add New Setup"
5. **Select your components** (fork and/or shock) by choosing Brand → Year → Model
6. **Enter your settings** - the form dynamically shows only the adjustments available for your specific components
7. **Save and manage** - Edit or delete setups as needed

## Project Structure

```
├── app/
│   ├── auth/           # Authentication pages (login, signup)
│   ├── dashboard/      # Protected dashboard and bike management
│   └── page.tsx        # Landing page
├── components/
│   ├── ui/             # shadcn/ui components
│   ├── adjustment-input.tsx  # Reusable suspension adjustment input
│   ├── setup-form.tsx  # Dynamic suspension setup form
│   ├── bikes-list.tsx  # Bike cards display
│   └── ...
├── lib/
│   └── supabase/       # Supabase client configuration
├── scripts/            # SQL migration scripts
└── public/             # Static assets
```


