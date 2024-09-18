import {
	Community,
	CommunitySnippet,
	CommunityState,
} from '@/atoms/communityAtom';
import { auth, firestore } from '@/firebase/clientApp';
import { collection, getDocs } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState } from 'recoil';

const useCommunityData = () => {
	const [user] = useAuthState(auth);
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
		} catch (error) {
			console.log('getMySnippets error', error);
		}
		setLoading(false);
	}, [user, setCommunityStateValue]);

	const joinCommunity = (communityData: Community) => {};

	const leaveCommunity = (communityId: string) => {};

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
