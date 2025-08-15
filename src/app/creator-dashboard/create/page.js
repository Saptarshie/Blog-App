// app/creator-dashboard/create/page.tsx  (SERVER component)
export const runtime = 'nodejs';

import { AddBlog } from '@/action/blogAction';
import CreateBlogClient from '@/components/pseudo-pages/CreateBlogClient';

export default function Page(initialData={
  title: '',
  description: '',
  content: '',
  tags: '',
  isPremium: false,
  image: null
}) {
  // You can fetch initialData here if needed (server side) and pass it down.
  return <CreateBlogClient AddBlog={AddBlog} initialData={initialData} />;
}
