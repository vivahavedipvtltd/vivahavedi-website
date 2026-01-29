# Deployment Guide

This document provides comprehensive instructions for deploying the Vivahavedi Matrimony Next.js application to various platforms and environments.

## Pre-Deployment Checklist

### Code Quality
- [ ] All TypeScript errors resolved
- [ ] ESLint checks pass
- [ ] All components properly tested
- [ ] Build process completes without errors
- [ ] Environment variables configured
- [ ] API endpoints tested and functional

### Performance Optimization
- [ ] Images optimized and using Next.js Image component
- [ ] Bundle size analyzed and optimized
- [ ] Core Web Vitals meet Google standards
- [ ] Mobile responsiveness verified
- [ ] SEO meta tags implemented

### Security
- [ ] No sensitive data in client-side code
- [ ] Environment variables properly secured
- [ ] HTTPS configured
- [ ] Security headers implemented
- [ ] Content Security Policy configured

## Build Process

### Local Production Build
```bash
# Clean install dependencies
npm ci

# Run type checking
npm run type-check

# Run linting
npm run lint

# Build for production
npm run build

# Test production build locally
npm start
```

### Environment Variables Setup
Create production environment file:
```bash
# .env.production
NEXT_PUBLIC_API_URL=https://api.vivamatrimony.com/api
NEXT_PUBLIC_SITE_URL=https://vivamatrimony.com
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Private variables (server-side only)
API_SECRET_KEY=your_secret_key
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
```

## Deployment Platforms

### 1. Vercel (Recommended)

#### Why Vercel?
- **Optimized for Next.js**: Built by the Next.js team
- **Automatic deployments**: Git-based deployment
- **Global CDN**: Fast worldwide delivery
- **Serverless functions**: Built-in API support
- **Analytics**: Performance monitoring included

#### Deployment Steps

##### Option A: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set production domain
vercel --prod
```

##### Option B: GitHub Integration
1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   ```
   Framework Preset: Next.js
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm ci
   ```

3. **Environment Variables**
   ```
   NEXT_PUBLIC_API_URL: https://api.vivamatrimony.com/api
   NEXT_PUBLIC_SITE_URL: https://vivamatrimony.com
   ```

4. **Custom Domain Setup**
   - Add custom domain in Vercel dashboard
   - Update DNS records as instructed
   - SSL certificate auto-generated

#### Vercel Configuration File
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm ci",
  "framework": "nextjs",
  "regions": ["bom1", "sin1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "origin-when-cross-origin"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/home",
      "destination": "/",
      "permanent": true
    }
  ]
}
```

### 2. Netlify

#### Deployment Steps
1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect GitHub repository

2. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://api.vivamatrimony.com/api
   NEXT_PUBLIC_SITE_URL=https://vivamatrimony.com
   ```

#### Netlify Configuration
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "origin-when-cross-origin"

[[redirects]]
  from = "/home"
  to = "/"
  status = 301
```

### 3. AWS Amplify

#### Deployment Steps
1. **Connect Repository**
   - Go to AWS Amplify Console
   - Click "New app" → "Host web app"
   - Connect GitHub repository

2. **Build Settings**
   ```yaml
   # amplify.yml
   version: 1
   applications:
     - frontend:
         phases:
           preBuild:
             commands:
               - npm ci
           build:
             commands:
               - npm run build
         artifacts:
           baseDirectory: .next
           files:
             - '**/*'
         cache:
           paths:
             - node_modules/**/*
   ```

3. **Environment Variables**
   - Add in Amplify Console → Environment variables

### 4. Traditional VPS/Server

#### Server Requirements
- **Node.js**: v18.x or higher
- **PM2**: Process manager for Node.js
- **Nginx**: Reverse proxy server
- **SSL Certificate**: Let's Encrypt or commercial

#### Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx

# Install SSL (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx
```

#### Application Deployment
```bash
# Clone repository
git clone https://github.com/your-repo/matrimonial-website.git
cd matrimonial-website

# Install dependencies
npm ci

# Build application
npm run build

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'vivamatrimony',
    script: 'npm',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### Nginx Configuration
```nginx
# /etc/nginx/sites-available/vivamatrimony.com
server {
    listen 80;
    server_name vivamatrimony.com www.vivamatrimony.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name vivamatrimony.com www.vivamatrimony.com;

    ssl_certificate /etc/letsencrypt/live/vivamatrimony.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/vivamatrimony.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files caching
    location /_next/static {
        alias /var/www/matrimonial-website/.next/static;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### SSL Certificate Setup
```bash
# Generate SSL certificate
sudo certbot --nginx -d vivamatrimony.com -d www.vivamatrimony.com

# Auto-renewal setup
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run type check
        run: npm run type-check

      - name: Run linter
        run: npm run lint

      - name: Build application
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### GitLab CI/CD
```yaml
# .gitlab-ci.yml
stages:
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "18"

test:
  stage: test
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm run type-check
    - npm run lint
  only:
    - merge_requests
    - main

build:
  stage: build
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - .next/
    expire_in: 1 hour
  only:
    - main

deploy:
  stage: deploy
  image: node:$NODE_VERSION
  script:
    - npm install -g vercel
    - vercel --token $VERCEL_TOKEN --prod
  only:
    - main
  when: manual
```

## Domain and DNS Configuration

### DNS Records Setup
```
# A Record
@ → Server IP Address (e.g., 192.168.1.100)

# CNAME Records
www → vivamatrimony.com
api → api.vivamatrimony.com

# MX Records (for email)
vivamatrimony.com → mail.vivamatrimony.com

# TXT Records (for verification)
vivamatrimony.com → "v=spf1 include:_spf.google.com ~all"
_dmarc.vivamatrimony.com → "v=DMARC1; p=quarantine; ruf=mailto:admin@vivamatrimony.com"
```

### CDN Configuration (Cloudflare)
```
# Cloudflare Settings
SSL/TLS: Full (strict)
Always Use HTTPS: On
HTTP Strict Transport Security: On
Minimum TLS Version: 1.2
Security Level: Medium
Browser Cache TTL: 4 hours
```

## Performance Optimization

### Next.js Configuration
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features
  experimental: {
    optimizeCss: true,
  },

  // Image optimization
  images: {
    domains: ['api.vivamatrimony.com', 'images.vivamatrimony.com'],
    formats: ['image/webp', 'image/avif'],
  },

  // Compression
  compress: true,

  // Bundle analyzer (for development)
  webpack: (config, { dev }) => {
    if (!dev) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
        })
      );
    }
    return config;
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

## Monitoring and Analytics

### Performance Monitoring
```typescript
// lib/analytics.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics service
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }
}

export function reportWebVitals() {
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
}
```

### Error Tracking
```typescript
// lib/error-tracking.ts
export function setupErrorTracking() {
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      // Send error to tracking service
      console.error('Global error:', event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
      // Send promise rejection to tracking service
      console.error('Unhandled promise rejection:', event.reason);
    });
  }
}
```

## Security Considerations

### Content Security Policy
```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googletagmanager.com *.google-analytics.com",
      "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
      "img-src 'self' data: *.vivamatrimony.com *.googletagmanager.com",
      "font-src 'self' fonts.gstatic.com",
      "connect-src 'self' *.vercel-insights.com *.google-analytics.com api.vivamatrimony.com",
    ].join('; '),
  },
];
```

### Environment Security
```bash
# Production environment variables
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Never commit these to version control
API_SECRET_KEY=secure_random_key
JWT_SECRET=another_secure_key
DATABASE_URL=encrypted_connection_string
```

## Backup and Recovery

### Database Backup
```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/matrimonial"
DB_NAME="vivamatrimony"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
mysqldump -u root -p $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "db_backup_*.sql" -mtime +7 -delete
```

### Application Backup
```bash
# Application backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR="/var/www/matrimonial-website"
BACKUP_DIR="/var/backups/matrimonial/app"

# Create backup
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz -C $APP_DIR .

# Keep only last 30 days
find $BACKUP_DIR -name "app_backup_*.tar.gz" -mtime +30 -delete
```

## Rollback Strategy

### Quick Rollback (Vercel)
```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback <deployment-url>
```

### Manual Rollback (VPS)
```bash
# Stop current application
pm2 stop vivamatrimony

# Switch to previous version
git checkout <previous-commit-hash>
npm ci
npm run build

# Restart application
pm2 restart vivamatrimony
```

## Post-Deployment Tasks

### Verification Checklist
- [ ] Website loads correctly on all devices
- [ ] All navigation links work properly
- [ ] Forms submit successfully
- [ ] API connections are functional
- [ ] SSL certificate is valid
- [ ] Performance metrics meet targets
- [ ] SEO tags are properly rendered
- [ ] Analytics tracking is working
- [ ] Error monitoring is active

### Monitoring Setup
- [ ] Set up uptime monitoring
- [ ] Configure performance alerts
- [ ] Set up error notifications
- [ ] Monitor Core Web Vitals
- [ ] Track user analytics
- [ ] Monitor server resources

---

**Last Updated**: September 26, 2025
**Deployment Guide Version**: 1.0.0
**Supported Platforms**: Vercel, Netlify, AWS, VPS