import { CommunityState } from '@/atoms/communityAtom';
import { Post } from '@/atoms/postsAtom';
import CreatePostLink from '@/components/Community/CreatePostLink';
import PageContent from '@/components/Layout/PageContent';
import PostItem from '@/components/Posts/PostItem';
import PostLoader from '@/components/Posts/PostLoader';
import { auth, firestore } from '@/firebase/clientApp';
import usePosts from '@/hooks/usePosts';
import { Stack } from '@chakra-ui/react';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import type { NextPage } from 'next';
import { useCallback, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilValue } from 'recoil';

const Home: NextPage = () => {
	const [user, loadingUser] = useAuthState(auth);
	const [loading, setLoading] = useState(false);
	const {
		postStateValue,
		setPostStateValue,
		onSelectPost,
		onDeletePost,
		onVote,
	} = usePosts();
	const communityStateValue = useRecoilValue(CommunityState);

	const buildUserHomeFeed = () => {
		// fetch some posts from each community the user is in
	};

	const buildNoUserHomeFeed = useCallback(async () => {
		setLoading(true);
		try {
			const postQuery = query(
				collection(firestore, 'posts'),
				orderBy('voteStatus', 'desc'),
				limit(10)
			);

			const postDocs = await getDocs(postQuery);

			const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

			// setPostState
			setPostStateValue((prev) => ({
				...prev,
				posts: posts as Post[],
			}));
		} catch (error) {
			console.log('buildNoUserHomeFeed error', error);
		}
		setLoading(false);
	}, [setPostStateValue]);

	const getUserPostVotes = () => {};

	// useEffects
	useEffect(() => {
		if (!user && !loadingUser) buildNoUserHomeFeed();
	}, [user, loadingUser, buildNoUserHomeFeed]);

	return (
		<PageContent>
			<>
				<CreatePostLink />
				{loading ? (
					<PostLoader />
				) : (
					<Stack>
						{postStateValue.posts.map((post) => (
							<PostItem
								key={post.id}
								post={post}
								onSelectPost={onSelectPost}
								onDeletePost={onDeletePost}
								onVote={onVote}
								userVoteValue={
									postStateValue.postVotes.find(
										(item) => item.postId === post.id
									)?.voteValue
								}
								userIsCreator={user?.uid === post.creatorId}
								homePage
							/>
						))}
					</Stack>
				)}
			</>
			<>{/* Recommendations */}</>
		</PageContent>
	);
};

export default Home;
