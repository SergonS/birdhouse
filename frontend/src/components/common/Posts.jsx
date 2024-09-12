// Components
import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { POSTS } from "../../utils/db/dummy";
// Tanstack
import { useQuery } from '@tanstack/react-query';
import { useEffect } from "react";

const Posts = ({ feedType }) => {

	// Determine which endpoint we are using dependending on the type of feed
	const getPostEndpoint = () => {
		switch (feedType)
		{
			case "forYou":
				return "/api/posts/all";
			case "following":
				return "/api/posts/following";
			default:
				return "/api/posts/all";
		}
	}

	const POST_ENDPOINT = getPostEndpoint();

	const { data: posts, isLoading, refetch, isRefetching } = useQuery({
		queryKey: ['posts'],
		queryFn: async() => {
			try
			{
				// Get
				const res = await fetch(POST_ENDPOINT);

				// Receiving response
				const data = await res.json();

				return data;
			}
			catch (error)
			{
				throw new Error(error);
			}
		},
	});

	useEffect(() => {
		refetch();

	}, [feedType, refetch]);

	return (
		<>
			{isLoading || isRefetching && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading || isRefetching && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch.</p>}
			{!isLoading || isRefetching && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;