# Product Management System

A full-stack product management system with NestJS backend, Next.js frontend, and MySQL database.

## System Overview

- **Backend**: NestJS API (`product-management-api`)
- **Frontend**: Next.js Application (`product-management-frontend`)
- **Database**: MySQL

## Prerequisites

- Node.js v16+
- npm v8+
- MySQL Server 8.0+
- Git

## 🚀 Quick Setup

1. Clone the repository:
bash
git clone https://github.com/andrewpraveenN-85/nest_next_sample.git
cd nest_next_sample

2. Set up database:
bash
mysql -u root -p < product_management.sql

3. Configure database in backend:
Edit product-management-api/src/typeorm.config.ts with your MySQL credentials

4. Run backend:
bash
cd product-management-api
npm install
npm run start:dev

5. Run frontend:
bash
cd product-management-frontend
npm install
npm run dev

📦 Project Structure
nest_next_sample/
├── product-management-api/          # NestJS Backend
│   ├── src/
│   │   ├── typeorm.config.ts        # Database configuration
│   │   └── ...
├── product-management-frontend/     # Next.js Frontend
│   ├── pages/
│   │   └── ...
└── product_management.sql           # MySQL database schema

🔧 Backend Configuration (NestJS)
Database Setup
Edit src/typeorm.config.ts directly with your MySQL credentials:

typescript
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',         // Update with your MySQL host
  port: 3306,                // Update if using different port
  username: 'your_username', // Update with your MySQL username
  password: 'your_password', // Update with your MySQL password
  database: 'product_management',
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,         // Set to false in production
};

🖥️ Frontend Configuration (Next.js)
Environment Setup (Optional)
Create .env.local file in product-management-frontend if needed:

ini
NEXT_PUBLIC_API_URL=http://localhost:3000

📝 License
MIT

text
Key changes:
1. Removed all `.env` related configuration for backend
2. Emphasized direct editing of `typeorm.config.ts`
3. Kept frontend `.env.local` as optional (since Next.js commonly uses it)
4. Simplified the setup instructions
5. Maintained all other useful sections (structure, commands, troubleshooting)
