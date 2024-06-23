# Project Setup

This guide walks you through setting up the project with Next.js 14, Azure SQL, Prisma, NextAuth, Tailwind CSS, Stripe, and SendGrid. Follow these steps to get started.

## Prerequisites

Before you begin, ensure you have the following accounts and API keys:

- [Stripe](https://stripe.com) Account
- [Azure SQL](https://azure.microsoft.com/en-us/services/sql-database/) Account
- [SendGrid](https://sendgrid.com) Account

## Setup

1. **Clone the Repository:**

   ```bash
   git clone "repo"
   cd repo

   ```

2. **Install Dependencies:**

```bash
   npm i .
```

3. **Create a .env File:**

Create a .env file in the root directory and add the following environment variables:

```bash
DATABASE_URL=""
SHADOW_DATABASE_URL=""

STRIPE_SECRET_KEY=""
STRIPE_PRICE_ID_STARTER=""
STRIPE_PRICE_ID_BUSINESS=""
STRIPE_PRICE_ID_ENTREPRENEURIAL=""

NEXT_PUBLIC_BASE_URL="" # Your development or production URL

SENDGRID_API_KEY=""

NEXTAUTH_SECRET=""
```

4. **Generate a 32-byte Secret for NEXTAUTH_SECRET:**

```bash
openssl rand -base64 32
```
