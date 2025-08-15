
export default async function createVector(blog) {
        try {
    await fetch(`${process.env.RECOMMENDER_API_URL}/vector`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        blog_id: newBlog._id,
        title: newBlog.title,
        description: newBlog.description,
        content: newBlog.content,
        tags: newBlog.tags,
        author: newBlog.author
        })
    });
    } catch (err) {
    console.error("Vector creation failed:", err);
    }

}