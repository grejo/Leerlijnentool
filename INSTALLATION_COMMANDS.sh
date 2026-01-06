#!/bin/bash

# Leerlijnentool - Installation Script
# Run this script after Node.js is installed

echo "========================================="
echo "Leerlijnentool - Automated Installation"
echo "========================================="
echo ""

# Check Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Error: Node.js is not installed"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo "✓ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to install dependencies"
    exit 1
fi

echo "✓ Dependencies installed successfully"
echo ""

# Setup environment file
echo "⚙️  Setting up environment..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✓ Created .env file"

    # Generate NEXTAUTH_SECRET
    if command -v openssl &> /dev/null
    then
        SECRET=$(openssl rand -base64 32)
        # Replace placeholder in .env file
        sed -i.bak "s/your-secret-key-change-this-in-production/$SECRET/" .env
        rm .env.bak
        echo "✓ Generated NEXTAUTH_SECRET"
    else
        echo "⚠️  Warning: openssl not found. Please manually set NEXTAUTH_SECRET in .env"
    fi
else
    echo "ℹ️  .env file already exists, skipping"
fi
echo ""

# Setup database
echo "🗄️  Setting up database..."
npm run db:push

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to push database schema"
    exit 1
fi

echo "✓ Database schema created"
echo ""

# Seed database
echo "🌱 Seeding database..."
npm run db:seed

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to seed database"
    exit 1
fi

echo "✓ Database seeded with initial data"
echo ""

# Success message
echo "========================================="
echo "✅ Installation completed successfully!"
echo "========================================="
echo ""
echo "📚 Next steps:"
echo ""
echo "1. Start the development server:"
echo "   npm run dev"
echo ""
echo "2. Open http://localhost:3000 in your browser"
echo ""
echo "3. Login with the default admin account:"
echo "   Email:    admin@leerlijnentool.nl"
echo "   Password: admin123"
echo ""
echo "4. Read QUICKSTART.md for a quick tour"
echo ""
echo "========================================="
