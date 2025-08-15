export const runtime = 'nodejs';
import { fetchBlogById } from "@/action/blogAction";
import CreateBlog from "../../create/page";
import Image from "next/image";
import Link from "next/link";
import CreateBlogClient from "@/components/pseudo-pages/CreateBlogClient"
import { AddBlog } from "@/action/blogAction";
export default async function EditBlog({params}){
    const res = await fetchBlogById(params["blog-id"]);
    console.log("res is: ",res);
    if(res.status === 403){
        return(

            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-2xl font-bold">You are not authorized to edit this blog</h1>
                <Link href="/creator-dashboard">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                        Go to Dashboard
                    </button>
                </Link>
            </div>
        )
    }
    return(
        <CreateBlogClient AddBlog={AddBlog} initialData={res.blog} />
    )
}