import { authModalState } from '@/atoms/authModalAtom';
import {
	Community,
	CommunitySnippet,
	CommunityState,
} from '@/atoms/communityAtom';
import { auth, firestore } from '@/firebase/clientApp';
import {
	collection,
	doc,
	getDocs,
	increment,
	writeBatch,
} from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useSetRecoilState } from 'recoil';

const useCommunityData = () => {
	const [user] = useAuthState(auth);
	const setAuthModalState = useSetRecoilState(authModalState);
	const [communityStateValue, setCommunityStateValue] =
		useRecoilState(CommunityState);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const onJoinOrLeaveCommunity = (
		communityData: Community,
		isJoined: boolean
	) => {
		// is the user signed in?
		// if not => open auth modal
		if (!user) {
			setAuthModalState({ open: true, view: 'login' });
			return;
		}

		if (isJoined) {
			leaveCommunity(communityData.id);
			return;
		}

		joinCommunity(communityData);
	};

	const getMySnippets = useCallback(async () => {
		setLoading(true);
		try {
			// get user snippets
			const snippetDocs = await getDocs(
				collection(firestore, `users/${user?.uid}/communitySnippets`)
			);

			const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));
			setCommunityStateValue((prev) => ({
				...prev,
				mySnippets: snippets as CommunitySnippet[],
			}));
		} catch (error: any) {
			console.log('getMySnippets error', error);
			setError(error.message);
		}
		setLoading(false);
	}, [user, setCommunityStateValue]);

	const joinCommunity = async (communityData: Community) => {
		try {
			// batch write
			const batch = writeBatch(firestore);

			// creating a new community snippet
			const newSnippet: CommunitySnippet = {
				communityId: communityData.id,
				imageUrl: communityData.imageUrl || '',
			};

			batch.set(
				doc(
					firestore,
					`users/${user?.uid}/communitySnippets`,
					communityData.id
				),
				newSnippet
			);

			// updating the numberOfMembers (+1)
			batch.update(doc(firestore, 'communities', communityData.id), {
				numberOfMembers: increment(1),
			});

			await batch.commit();

			// update recoil state – communityState.mySnippets
			setCommunityStateValue((prev) => ({
				...prev,
				mySnippets: [...prev.mySnippets, newSnippet],
			}));
		} catch (error: any) {
			console.log('joinCommunity error', error);
			setError(error.message);
		}

		setLoading(false);
	};

	const leaveCommunity = async (communityId: string) => {
		// update recoil state – communityState.mySnippets
		try {
			// batch write
			const batch = writeBatch(firestore);

			// deleting the community snippet
			batch.delete(
				doc(firestore, `users/${user?.uid}/communitySnippets`, communityId)
			);

			// updating the numberOfMembers (-1)
			batch.update(doc(firestore, 'communities', communityId), {
				numberOfMembers: increment(-1),
			});

			await batch.commit();

			setCommunityStateValue((prev) => ({
				...prev,
				mySnippets: prev.mySnippets.filter(
					(item) => item.communityId !== communityId
				),
			}));
		} catch (error: any) {
			console.log('leaveCommunity error', error);
			setError(error.message);
		}
		setLoading(false);
	};

	useEffect(() => {
		if (!user) return;
		getMySnippets();
	}, [user, getMySnippets]);

	return {
		// data and functions
		communityStateValue,
		onJoinOrLeaveCommunity,
		loading,
	};
};

export default useCommunityData;