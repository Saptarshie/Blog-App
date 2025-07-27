# BlogApp - A Next.js Blogging Platform

A modern, feature-rich blogging platform built with Next.js that allows users to create, read, and manage blog content with premium features.

## Features

- **User Authentication**: Secure login and registration system
- **Creator Dashboard**: Dedicated interface for content creators
- **Rich Text Editing**: Create beautiful blog posts with React Quill
- **Premium Content**: Option to mark content as premium for subscribers
- **Search Functionality**: Find content easily with the built-in search
- **Responsive Design**: Optimized for mobile and desktop experiences
- **Image Upload**: Support for featured images in blog posts

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **State Management**: Redux Toolkit
- **Authentication**: JWT, bcryptjs
- **Content Editing**: Tip-tap editor
- **Backend**: Next.js API routes with server actions
- **Database**: MongoDB with Mongoose
- **Validation**: Joi

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MongoDB connection

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/blogapp.git
   cd blogapp
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the project root with the following variables:
   ```
   INFURA_ID=
   NEXT_PUBLIC_INFURA_ID=
   MONGODB_URL=
   ```

1. Run the development server:
   ```bash
   npm run dev
   ```
## Project Structure

```
blogapp/
├── public/
│   └── upload/
│       └── thumbnail/  # Blog post images
├── src/
│   ├── action/         # Server actions
│   ├── app/            # Next.js app directory
│   ├── components/     # Reusable components
│   ├── database/       # Database connection
│   ├── models/         # Mongoose models
│   ├── store/          # Redux store
│   │   └── slices/     # Redux slices
│   └── utils/          # Utility functions
├── .env.local          # Environment variables
└── package.json        # Project dependencies
```

## Usage

### Creating a Blog Post

1. Log in to your account
2. Navigate to the Creator Dashboard
3. Click "Create New Post"
4. Fill in the title, description, and content
5. Optionally add tags and a featured image
6. Toggle premium status if desired
7. Click "Publish" to post your blog

### Becoming a Creator

1. Navigate to the "Become a Creator" page from the navbar
2. Complete your profile information
3. Submit your application
4. Once approved, you'll have access to the Creator Dashboard

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Bugs
- On uploading new blog , the thumbnail image is not showing unless server is restarted.
- Subscription payment history tracker is not yet implemented ,...hence users can double-count payments (probably a request-id based / random-disposable wallet based payments will be implemented in future)

## Future Plans (feel free to contribute🫡)

- Add a commenting feature for blog posts.
- Integrate Gemini/OpenRouter for search-summary and as content-creation assistant.
- Enhance the search functionality with autocomplete.
- Implement a earnings-time chart (in the earnings Page).
- Add a "Save for later" feature for users.
- Integrate a newsletter subscription system.
- Implement a referral program for users.
- Add a "Like" feature for blog posts.
- Integrate a social sharing system for blog posts.
- Add a "Follow" feature for users.
- Implement a "Recommendations" feature for users.
- Integrate a "Notifications" system for users.
- Add a "Report" feature for users to report inappropriate content.
- Implement a "Flag" feature for users to flag inappropriate content.
- Add a "Share" feature for users to share blog posts on social media.
---

Thank you for considering BlogApp for your blogging needs!