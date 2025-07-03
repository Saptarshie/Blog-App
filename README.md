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
- **Content Editing**: React Quill
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
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Run the development server:
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

## Future Plans

- Implement a history tracker for users.
- Add a commenting feature for blog posts.
- Integrate Gemini/OpenRouter for search-summary and as content-creation assistant.
- Enhance the search functionality with autocomplete.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
(Quick tips :- just mention my name 😅 'Saptarshi' , since i'm currently suffring from a huge shortage of Validation in my life😎)

---

Thank you for considering BlogApp for your blogging needs!