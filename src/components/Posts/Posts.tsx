import { Community } from '@/atoms/communityAtom';
import { Post } from '@/atoms/postsAtom';
import { auth, firestore } from '@/firebase/clientApp';
import usePosts from '@/hooks/usePosts';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import PostItem from './PostItem';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Stack } from '@chakra-ui/react';
import PostLoader from './PostLoader';

type PostsProps = {
	communityData: Community;
};

const Posts: React.FC<PostsProps> = ({ communityData }) => {
	const [user] = useAuthState(auth);
	const [loading, setLoading] = useState(false);
	const {
		postStateValue,
		setPostStateValue,
		onVote,
		onDeletePost,
		onSelectPost,
	} = usePosts();

	const getPosts = useCallback(async () => {
		try {
			setLoading(true);
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
		} catch (error: any) {
			console.log('getPosts error', error.message);
		}
		setLoading(false);
	}, [communityData.id, setPostStateValue]);

	useEffect(() => {
		getPosts();
	}, [getPosts]);

	return (
		<>
			{loading ? (
				<PostLoader />
			) : (
				<Stack>
					{postStateValue.posts.map((item) => (
						<PostItem
							post={item}
							userIsCreator={user?.uid === item.creatorId}
							userVoteValue={
								postStateValue.postVotes.find((vote) => vote.postId === item.id)
									?.voteValue
							}
							onVote={onVote}
							onSelectPost={onSelectPost}
							onDeletePost={onDeletePost}
							key={item.id}
						/>
					))}
				</Stack>
			)}
		</>
	);
};
export default Posts;
