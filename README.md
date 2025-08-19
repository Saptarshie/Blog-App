# BlogApp - A Next.js Blogging Platform

A modern, feature-rich blogging platform built with Next.js that allows users to create, read, and manage blog content with premium features.

## It's Live 🥳🎊🎉....  scroll down to.....and .....graaab the link🤩

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
├── .gitignore
├── jsconfig.json
├── next.config.mjs
├── package-lock.json
├── package.json
├── playwright.config.js
├── postcss.config.mjs
├── README.md
├── tmp.txt
├── public/
│   ├── upload/
│   │   └── thumbnail/
├── recommmender4/
│   ├── celery_app.py
│   ├── requirements.txt
│   ├── run.txt
│   └── app/
│       ├── __init__.py
│       ├── config.py
│       ├── database.py
│       ├── main.py
│       ├── models.py
│       ├── schemas.py
│       ├── utils.py
│       └── services/
│           ├── __init__.py
│           ├── compute_embedding.py
│           ├── recommend_service.py
│           ├── task_queue.py
│           └── vector_service.py
├── src/
│   ├── middleware.js
│   ├── action/
│   │   ├── blogAction.js
│   │   ├── index.js
│   │   ├── subscriptionAction.js
│   │   ├── userAction.js
│   │   └── helper/
│   │       ├── cloudinaryConfig.js
│   │       ├── createVector.js
│   │       ├── handleImage.js
│   │       ├── storePendingTransaction.js
│   │       ├── trackBlogVisit.js
│   │       └── verifyTransaction.js
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.js
│   │   ├── loading.js
│   │   ├── page.js
│   │   ├── authenticate/
│   │   │   ├── page.js
│   │   │   ├── sign-in/
│   │   │   │   └── page.js
│   │   │   └── sign-up/
│   │   │       └── page.js
│   │   ├── become-creator/
│   │   │   └── page.js
│   │   ├── blogs/
│   │   │   └── [blog-id]/
│   │   ├── creator-dashboard/
│   │   │   ├── get-server-side-prop.js
│   │   │   ├── page.js
│   │   │   ├── blogs/
│   │   │   │   └── page.js
│   │   │   ├── create/
│   │   │   │   └── page.js
│   │   │   ├── earnings/
│   │   │   │   └── page.js
│   │   │   └── edit/
│   │   │       └── [blog-id]/
│   │   ├── history/
│   │   │   └── page.js
│   │   ├── profile/
│   │   │   └── page.js
│   │   ├── search/
│   │   │   └── page.js
│   │   ├── settings/
│   │   │   └── page.js
│   │   └── subscribe/
│   │       └── page.js
│   ├── components/
│   │   ├── blog-feed/
│   │   │   ├── blog-card/
│   │   │   │   └── index.js
│   │   │   └── blog-list/
│   │   │       └── index.js
│   │   ├── buttons/
│   │   │   └── logout-button.js
│   │   ├── cards/
│   │   │   └── CreatorBlogCard.js
│   │   ├── common-layout/
│   │   │   └── index.js
│   │   ├── creator/
│   │   │   └── ImageUploader.js
│   │   ├── editor/
│   │   │   └── tip-tap-editor/
│   │   │       ├── index.js
│   │   │       └── tip-tap-style.css
│   │   ├── history-list/
│   │   │   └── index.js
│   │   ├── joi-schemas/
│   │   │   └── add-blog.js
│   │   ├── navbar/
│   │   │   └── index.js
│   │   └── pseudo-pages/
│   │       └── CreateBlogClient.js
│   ├── database/
│   │   └── index.js
│   ├── models/
│   │   └── index.js
│   ├── provider/
│   │   └── index.js
│   ├── services/
│   │   └── transactionMonitor.js
│   ├── store/
│   │   ├── index.js
│   │   └── slices/
│   │       ├── blog-slice.js
│   │       └── user-slice.js
│   ├── types/
│   │   └── heroicons-react.d.ts
│   └── utils/
│       └── functions/
│           └── isValidWallet.js
└── tests/
    └── hello.spec.js

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

# congratulations 🥳 , thanks for your generous scrolling 🙂 , 
here's it is: https://onlypain.in 🙃