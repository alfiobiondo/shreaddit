import { Community } from '@/atoms/communityAtom';
import { Post } from '@/atoms/postsAtom';
import { firestore } from '@/firebase/clientApp';
import usePosts from '@/hooks/usePosts';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';

type PostsProps = {
	communityData: Community;
};

const Posts: React.FC<PostsProps> = ({ communityData }) => {
	// useAuthState
	const [loading, setLoading] = useState(false);
	const { postStateValue, setPostStateValue } = usePosts();

	const getPosts = useCallback(async () => {
		try {
			// get posts for this community
			const postQuery = query(
				collection(firestore, 'posts'),
				where('communityId', '==', communityData.id),
				orderBy('createdAt', 'desc')
			);

			const postDocs = await getDocs(postQuery);

			const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
			setPostStateValue((prev) => ({
				...prev,
				posts: posts as Post[],
			}));

			console.log('Posts', posts);
		} catch (error: any) {
			console.log('getPosts error', error.message);
		}
	}, [communityData.id, setPostStateValue]);

	useEffect(() => {
		// IIFE to handle async operations
		getPosts();
	}, [getPosts]);

	return <div>Posts</div>;
};
export default Posts;
