# BlogApp - A Next.js Blogging Platform

"Welcome to the blog app that's so smooth, it makes other websites jealous! We're like the cool kid on the block who actually knows how to party (and by party, we mean load instantly and look fabulous doing it)."

## It's Live 😉🎊🎉....  scroll down below.....and .....graaab the link🤩

---

## Shameless self Promotion (not for recruiters)

# 🌟 Why Choose Us?

Ever visited a blog that loads slower than a turtle on vacation? Yeah, us too.  
That's why we built this platform! Our blog app is:

- ⚡ **Faster** than your last-minute deadline panic  
- 🧠 **So responsive**, it practically reads your mind  
- 🧹 **Cleaner** than your search history after using incognito mode  
- ⏰ **More reliable** than your friend who's always "five minutes away"  

---

# ✍️ For Writers

Unleash your inner Shakespeare (or Dr. Seuss, we don't judge) with our writer-friendly platform that:

- 💾 Saves your work faster than you can say *"Where did I put my coffee?"*  
- ✅ Formats your posts so well, even your grammar-obsessed aunt would approve  
- 🛠️ Lets you focus on writing instead of wrestling with complicated tools  

---

# 📖 For Readers

Get lost in amazing content without getting lost in slow-loading pages. We offer:

- 🌊 Reading so smooth, you'll forget you're online  
- ⚡ Articles that load before you can finish saying *"I'll just read one more"*  
- 🧼 A layout so clean, Marie Kondo would be proud  

---

# 🤝 Our Promise

We promise to:

- 🚫 Never make you watch a loading spinner long enough to contemplate your life choices  
- 👨‍💻 Keep things simple enough that your tech-challenged uncle could use it  
- 💸 Make your blog experience more enjoyable than finding money in your pocket  

---

# 🎉 Call to Action

**Ready to join the blog that's more fun than a cat video marathon?**  
Stop reading this description and start exploring!  

👉 Your next favorite post is waiting, and trust us, it loads faster than you can decide what to have for lunch.  

---

# 📢 Social Media Snippets

- 📝 *Write like a pro, read like a boss.*  
  Our blog app: Where great content meets great speed!  
  `#BlogLife #FastAndFuriousReading`

- ⚡ *Warning: May cause extreme satisfaction and addiction to quality content.*  
  Side effects include reading *"just one more post"* at 3 AM.  
  `#BlogAddict #YoureWelcome`


## Boring technical parts: 


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
- **Image Hosting**: Cloudinary
- **Ai Streaming**: OpenAI SDK with OpenRouter API

# 🚀 Why we are not so different:

Explore our cutting-edge blog app, designed to deliver seamless performance and exceptional user experience:

- ⚡ **Instant Page Transitions**  
  Powered by Next.js's dynamic routing for lightning-fast navigation.

- 🔍 **Server-Side Rendering (SSR)**  
  Boost your SEO with pre-rendered content for search engine visibility.

- 📱 **Mobile-Responsive Design**  
  Enjoy flawless viewing across all devices—phones, tablets, and desktops.

- 🔄 **Real-Time Content Updates**  
  Engage users with live data and interactive features.

- 🔐 **Secure User Authentication**  
  Robust access control and content management for peace of mind.

- 🖼️ **Optimized Images & Media Delivery**  
  Fast-loading visuals for a smoother experience.

- 🌐 **Progressive Web App (PWA) Capabilities**  
  Offline access, app-like behavior, and enhanced performance.

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
   NEXT_PUBLIC_APP_URL=
   INFURA_ID=
   NEXT_PUBLIC_INFURA_ID=
   MONGODB_URL=
   OPENROUTER_API_KEY2=
   MODEL_NAME=
   MODEL_NAME_ENHANCE=
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   EMAIL_USER=
   EMAIL_PASS=
   RECOMMENDER_API_URL=
   JWT_SECRET=
   ```

1. Run the development server:
   ```bash
   npm run dev
   ```
## Project Structure

```
Blog-App/
├── .gitignore
├── jsconfig.json
├── next.config.mjs
├── package-lock.json
├── package.json
├── playwright.config.js
├── postcss.config.mjs
├── README.md
├── tmp.txt
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
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.js
│   │   ├── authenticate/
│   │   │   ├── page.js
│   │   │   ├── forgot-passward/
│   │   │   │   └── page.js
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
│   │   ├── recommendation/
│   │   │   └── page.js
│   │   ├── search/
│   │   │   └── page.js
│   │   ├── settings/
│   │   │   └── page.js
│   │   └── subscribe/
│   │       └── page.js
│   ├── components/
│   │   ├── ask-ai/
│   │   │   ├── AskAIWrapper.js
│   │   │   ├── index.js
│   │   │   ├── index2.js
│   │   │   └── thinkingAnimation.js
│   │   ├── blog-feed/
│   │   │   ├── blog-card/
│   │   │   │   └── index.js
│   │   │   ├── blog-list/
│   │   │   │   └── index.js
│   │   │   └── similar-blogs/
│   │   │       └── index.js
│   │   ├── blog-read-aloud/
│   │   │   ├── blog-read-aloud.js
│   │   │   ├── index.js
│   │   │   └── stripHtmlForReadAloud.js
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
│   │   ├── hooks/
│   │   │   └── useReadAloud.js
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
- Subscription payment history tracker is not yet implemented ,...hence users can double-count payments (probably a request-id based / random-disposable wallet based payments will be implemented in future)
- Backend recmmender suddenly stopped working for newly uploaded blogs (unable to vectorize)

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

# You are awesome , Don't get angry , Thanks for your generous scrolling 🙂 , 
here's it is: https://onlypain.in 🙃 (since , render server not allowing us to send emails , you can's signup , use cred: username: sapta7 , passward: asdf1234)