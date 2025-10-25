# 🗃️ BREAKSY Supabase Integration Setup Guide

## ✅ Installation Complete

Your BREAKSY project now has comprehensive Supabase integration with Claude Code! Here's everything you need to get connected.

## 🚀 Quick Setup Steps

### 1. Get Your Supabase Credentials

#### From Supabase Dashboard:
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your BREAKSY project (or create a new one)
3. Go to **Settings** → **API**

**Copy these values:**
```bash
# Basic Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Project Reference (from URL)
SUPABASE_PROJECT_REF=your-project-id
```

#### Get Personal Access Token:
1. Go to **Account Settings** → **Access Tokens**
2. Create a new token with appropriate permissions
3. Copy the token:
```bash
SUPABASE_ACCESS_TOKEN=sbp_your_personal_access_token_here
```

### 2. Configure Environment Variables

Create a `.env` file from the template:
```bash
cp .env.example .env
```

Fill in your Supabase credentials in the `.env` file:
```bash
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_actual_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key

# Supabase MCP Integration
SUPABASE_ACCESS_TOKEN=your_actual_access_token
SUPABASE_PROJECT_REF=your_actual_project_ref
```

### 3. Update MCP Configuration

Your `.mcp.json` is already configured! Just replace the placeholders:
```json
{
  "supabase": {
    "args": [
      "-y",
      "@supabase/mcp-server-supabase@latest",
      "--project-ref=YOUR_ACTUAL_PROJECT_REF"
    ],
    "env": {
      "SUPABASE_ACCESS_TOKEN": "YOUR_ACTUAL_ACCESS_TOKEN",
      "SUPABASE_URL": "YOUR_ACTUAL_URL",
      "SUPABASE_ANON_KEY": "YOUR_ACTUAL_ANON_KEY"
    }
  }
}
```

## 🤖 Available Supabase Agents

You now have access to these Supabase specialists:

### **supabase-schema-architect**
Design and optimize database schemas for your BREAKSY app
```
@supabase-schema-architect Design user profiles table for addiction recovery tracking
```

### **supabase-realtime-optimizer**
Optimize real-time subscriptions and live data updates
```
@supabase-realtime-optimizer Set up real-time progress tracking for user commitments
```

## ⚡ Available Supabase Commands

### Database Management
- `/supabase-schema-sync` - Synchronize database schema changes
- `/supabase-migration-assistant` - Manage database migrations
- `/supabase-backup-manager` - Database backup and restore operations

### Development Tools
- `/supabase-data-explorer` - Explore and query database data
- `/supabase-type-generator` - Generate TypeScript types from database schema
- `/supabase-security-audit` - Audit database security and RLS policies

### Performance & Monitoring
- `/supabase-performance-optimizer` - Optimize database performance
- `/supabase-realtime-monitor` - Monitor real-time subscriptions

## 🏗️ BREAKSY Database Schema Suggestions

Based on your addiction recovery app, here are recommended tables:

### Core Tables
```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  recovery_start_date DATE,
  goal_days INTEGER DEFAULT 30,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0
);

-- Commitments table (for Touch ID commitment feature)
CREATE TABLE commitments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  commitment_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  authenticated_with_biometric BOOLEAN DEFAULT FALSE,
  goal_duration_days INTEGER,
  is_active BOOLEAN DEFAULT TRUE
);

-- Progress tracking
CREATE TABLE daily_check_ins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  check_in_date DATE DEFAULT CURRENT_DATE,
  status TEXT CHECK (status IN ('success', 'relapse', 'struggling')),
  notes TEXT,
  mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Support system
CREATE TABLE support_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  contact_name TEXT NOT NULL,
  contact_phone TEXT,
  contact_email TEXT,
  relationship TEXT,
  is_emergency_contact BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security (RLS)
```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE commitments ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_contacts ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
```

## 🚀 Quick Usage Examples

### Set Up Database Schema
```
@supabase-schema-architect Create tables for user profiles, commitments, and daily check-ins for addiction recovery app

/supabase-schema-sync
```

### Generate TypeScript Types
```
/supabase-type-generator Generate types for BREAKSY database tables
```

### Monitor Performance
```
@supabase-realtime-optimizer Set up real-time updates for user progress tracking

/supabase-performance-optimizer Optimize queries for user dashboard
```

### Security Audit
```
/supabase-security-audit Review RLS policies for user data protection
```

## 🔐 Security Best Practices

### Row Level Security (RLS)
- **Always enable RLS** on tables containing user data
- **Restrict access** so users can only see their own records
- **Use auth.uid()** for user identification in policies

### API Keys
- **Never commit** Supabase keys to version control
- **Use service role key** only on the server side
- **Use anon key** for client-side operations

### Data Privacy (Important for BREAKSY)
- **Encrypt sensitive data** like detailed addiction history
- **Implement data retention policies** for privacy compliance
- **Allow users to delete** their data completely
- **Audit access logs** for sensitive operations

## 🧪 Test Your Connection

Once configured, test with:
```
@supabase-schema-architect Check connection to BREAKSY database

/supabase-data-explorer Show current database tables
```

## 📱 iOS Integration

For your iOS app, you'll want to install the Supabase Swift client:

```swift
// In Package.swift or Xcode
.package(url: "https://github.com/supabase/supabase-swift", from: "2.0.0")
```

Then configure in your app:
```swift
import Supabase

let supabase = SupabaseClient(
    supabaseURL: URL(string: "YOUR_SUPABASE_URL")!,
    supabaseKey: "YOUR_ANON_KEY"
)
```

## 🎯 BREAKSY-Specific Features

### Touch ID Commitment Integration
With Supabase, you can:
- **Store biometric-authenticated commitments** securely
- **Track commitment compliance** with real-time updates
- **Sync across devices** while maintaining privacy

### Real-time Progress Sharing
- **Family/partner dashboards** with privacy controls
- **Real-time streak updates** for accountability
- **Emergency contact notifications** during struggles

### Analytics & Insights
- **Anonymous usage analytics** for app improvement
- **Recovery pattern analysis** for personalized recommendations
- **Community success metrics** (anonymized)

Your Supabase integration is now ready! This gives you a production-ready backend for your addiction recovery app with real-time capabilities, secure authentication, and comprehensive data management. 🚀