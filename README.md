# 🔍 GitHub Summarizer

An AI-powered platform that provides comprehensive summaries and insights for any GitHub repository. Built with Next.js, this application leverages advanced AI models (Anthropic Claude, OpenAI GPT, or Google Gemini) to help developers understand complex projects in minutes instead of hours.

## ✨ Features

- **🤖 AI-Powered Summaries**: Get comprehensive summaries of any GitHub repository using advanced AI models (Claude 3.5 Sonnet, GPT-4o, or Gemini 2.0 Flash)
- **✨ Cool Facts Discovery**: Automatically uncover interesting facts and insights about repositories
- **🔒 Secure API Access**: Manage your API keys securely with a comprehensive dashboard
- **📊 Usage Tracking**: Monitor API key usage and rate limits
- **🎮 API Playground**: Test your API keys in a safe, interactive environment
- **👤 User Authentication**: Secure signup/login system with JWT tokens
- **🛡️ Protected Routes**: Access control for authenticated users
- **📚 Comprehensive Documentation**: Built-in documentation and API reference

## 🚀 Tech Stack

- **Framework**: Next.js 16.0.7
- **UI Library**: React 19.2.0
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **AI/LLM**: LangChain with Anthropic Claude, OpenAI GPT, or Google Gemini
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **Validation**: Zod

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18+ and npm
- A Supabase account and project
- An Anthropic API key, OpenAI API key, OR Google Gemini API key (at least one required)

## 🛠️ Installation

1. **Clone the repository** (or navigate to your project directory):
   ```bash
   cd my-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # AI/LLM Configuration (at least one required)
   ANTHROPIC_API_KEY=your_anthropic_api_key
   # OR
   OPENAI_API_KEY=your_openai_api_key
   # OR
   GEMINI_API_KEY=your_gemini_api_key
   
   # JWT Secret (for authentication)
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Set up Supabase database**:
   
   Follow the setup guides in the project:
   - Run `users-table-setup.sql` to create the users table (see `AUTH_SETUP.md`)
   - Run `supabase-setup.sql` to create the API keys table (see `SUPABASE_SETUP.md`)
   - Run `api-keys-migration.sql` and `api-keys-rate-limit-migration.sql` if needed

## 🏃 Getting Started

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

3. **Create an account**:
   - Click "Sign Up" to create a new account
   - You'll be redirected to the dashboard after successful signup

4. **Create an API Key**:
   - Go to the Dashboard
   - Click "Create New Key"
   - Enter a name and generate/enter your API key

5. **Test the API**:
   - Navigate to the Playground
   - Enter your API key and a GitHub repository URL
   - Click "Summarize Repository" to get AI-generated insights

## 📖 API Usage

### Endpoint: `/api/github-summarizer`

**Method**: `POST`

**Headers**:
```
x-api-key: your-api-key
Content-Type: application/json
```

**Request Body**:
```json
{
  "githubUrl": "https://github.com/owner/repo"
}
```

**Response**:
```json
{
  "success": true,
  "repository": {
    "owner": "owner",
    "repo": "repo",
    "branch": "main",
    "url": "https://github.com/owner/repo"
  },
  "summary": "Comprehensive summary of the repository...",
  "cool_facts": [
    "Interesting fact 1",
    "Interesting fact 2"
  ]
}
```

**Error Responses**:
- `401`: Invalid or missing API key
- `429`: Rate limit exceeded
- `400`: Invalid request (missing GitHub URL or invalid format)
- `404`: README not found in repository
- `500`: Internal server error

### API Key Validation

**Method**: `GET`

**Headers**:
```
x-api-key: your-api-key
```

**Response**:
```json
{
  "message": "API key validated successfully",
  "valid": true,
  "usage": 5,
  "rateLimit": 100
}
```

## 📁 Project Structure

```
my-app/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── api-keys/      # API key management
│   │   │   └── github-summarizer/  # Main API endpoint
│   │   ├── dashboards/        # API keys dashboard
│   │   ├── playground/        # API testing playground
│   │   ├── documentation/     # Documentation page
│   │   ├── login/             # Login page
│   │   ├── signup/            # Signup page
│   │   └── page.js            # Home/landing page
│   ├── components/            # React components
│   ├── contexts/              # React contexts (AuthContext)
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility libraries
│   └── utils/                 # Helper utilities
├── public/                    # Static assets
├── AUTH_SETUP.md             # Authentication setup guide
├── SUPABASE_SETUP.md         # Supabase setup guide
└── *.sql                     # Database migration files
```

## 🔐 Authentication

The application uses JWT-based authentication with password hashing via bcryptjs. User sessions are stored in localStorage.

**API Endpoints**:
- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/login` - Authenticate a user
- `POST /api/auth/verify` - Verify a user session

See `AUTH_SETUP.md` for detailed authentication setup instructions.

## 🗄️ Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `password` (String, Hashed)
- `name` (String)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### API Keys Table
- `id` (UUID, Primary Key)
- `name` (String)
- `key` (String, Unique)
- `usage` (Integer)
- `rate_limit` (Integer)
- `last_used` (Timestamp)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

## 🎨 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔒 Security Considerations

⚠️ **For Production Use**:

1. Use HTTP-only cookies instead of localStorage for session management
2. Implement password strength requirements
3. Add email verification
4. Implement rate limiting on login/signup endpoints
5. Use more secure password hashing (consider bcrypt with higher rounds)
6. Add CSRF protection
7. Implement proper session expiration
8. Update RLS policies in Supabase to restrict access based on user ID
9. Use environment variables for all sensitive data
10. Never commit `.env.local` to version control

## 📝 Environment Variables

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, OR `GEMINI_API_KEY` - At least one AI provider API key required
- `JWT_SECRET` - Secret key for JWT token signing

**Note**: The application will use AI models in the following priority order: Anthropic Claude (if `ANTHROPIC_API_KEY` is set) → OpenAI GPT (if `OPENAI_API_KEY` is set) → Google Gemini (if `GEMINI_API_KEY` is set). You only need to set one API key, but you can set multiple if you want fallback options.

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [LangChain Documentation](https://js.langchain.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and proprietary.

## 🆘 Support

For issues and questions:
- Check the Documentation page in the application
- Review the setup guides (`AUTH_SETUP.md`, `SUPABASE_SETUP.md`)
- Check the API playground for testing

---

Built with ❤️ using Next.js and AI
