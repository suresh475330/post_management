
import Navbar from "../components/Navbar"
import PostCard from "../components/PostCard"
import Comments from "../components/Comments"

export default function Home() {
    return (
        <div>
            <Navbar />
            <Comments />
            <PostCard/>

        </div>
    )
}