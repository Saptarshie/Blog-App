// src/action/helper/createVector.js
export default async function createVector(blog) {
  console.log("Create Vector Called...");
  console.log("blog:", blog);

  if (!blog) {
    console.error("createVector: missing blog");
    return;
  }

  // convert _id to string because Mongo ObjectId may not JSON-serialize nicely
  const blogId = blog._id ? String(blog._id) : blog.id || null;

  const payload = {
    blog_id: blogId,
    title: blog.title ?? "",
    description: blog.description ?? "",
    content: blog.content ?? "",
    tags: Array.isArray(blog.tags) ? blog.tags : [],
    author: blog.author ?? ""
  };

  try {
    const res = await fetch(`${process.env.RECOMMENDER_API_URL}/vector`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    console.log("Vector creation response:", res);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("Vector creation failed: HTTP", res.status, text);
      return;
    }

    const json = await res.json().catch(() => null);
    console.log("Vector creation response:", json);
    return json;
  } catch (err) {
    console.error("Vector creation failed:", err);
    console.log("Vector creation failed:", err);
    // throw err;
    return { success: false,status:417, error: err.message }; 
  }
}
