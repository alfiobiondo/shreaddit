import { CommunityState } from '@/atoms/communityAtom';
import { Post, PostVote } from '@/atoms/postsAtom';
import CreatePostLink from '@/components/Community/CreatePostLink';
import PersonalHome from '@/components/Community/PersonalHome';
import Premium from '@/components/Community/Premium';
import Recommendations from '@/components/Community/Recommendations';
import PageContent from '@/components/Layout/PageContent';
import PostItem from '@/components/Posts/PostItem';
import PostLoader from '@/components/Posts/PostLoader';
import { auth, firestore } from '@/firebase/clientApp';
import useCommunityData from '@/hooks/useCommunityData';
import usePosts from '@/hooks/usePosts';
import { Stack } from '@chakra-ui/react';
import {
	collection,
	getDocs,
	limit,
	orderBy,
	query,
	where,
} from 'firebase/firestore';
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
	const { communityStateValue } = useCommunityData();

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

	const buildUserHomeFeed = useCallback(async () => {
		setLoading(true);
		try {
			if (communityStateValue.mySnippets.length) {
				// get posts from users' communities
				const myCommunityIds = communityStateValue.mySnippets.map(
					(snippet) => snippet.communityId
				);

				const postQuery = query(
					collection(firestore, 'posts'),
					where('communityId', 'in', myCommunityIds),
					limit(10)
				);

				const postDocs = await getDocs(postQuery);

				const posts = postDocs.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));

				setPostStateValue((prev) => ({
					...prev,
					posts: posts as Post[],
				}));
			} else {
				buildNoUserHomeFeed();
			}
		} catch (error) {
			console.log('buildUserHomeFeed error', error);
		}
		setLoading(false);
	}, [buildNoUserHomeFeed, communityStateValue.mySnippets, setPostStateValue]);

	const getUserPostVotes = useCallback(async () => {
		try {
			const postIds = postStateValue.posts.map((post) => post.id);

			const postVotesQuery = query(
				collection(firestore, `users/${user?.uid}/postVotes`),
				where('postId', 'in', postIds)
			);

			const postVotesDoc = await getDocs(postVotesQuery);

			const postVotes = postVotesDoc.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			setPostStateValue((prev) => ({
				...prev,
				postVotes: postVotes as PostVote[],
			}));
		} catch (error) {
			console.log('getUserPostVotes error', error);
		}
	}, [postStateValue.posts, user?.uid, setPostStateValue]);

	// useEffects
	useEffect(() => {
		if (communityStateValue.snippetsFetched) buildUserHomeFeed();
	}, [buildUserHomeFeed, communityStateValue.snippetsFetched]);

	useEffect(() => {
		if (!user && !loadingUser) buildNoUserHomeFeed();
	}, [user, loadingUser, buildNoUserHomeFeed]);

	useEffect(() => {
		if (user && postStateValue.posts.length) getUserPostVotes();

		// cleanup finction
		return () => {
			// clear post votes when user logs out
			setPostStateValue((prev) => ({
				...prev,
				postVotes: [],
			}));
		};
	}, [user, postStateValue.posts, getUserPostVotes, setPostStateValue]);

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
			<Stack spacing={5}>
				<Recommendations />
				<Premium />
				<PersonalHome />
			</Stack>
		</PageContent>
	);
};

export default Home;
