import { Timestamp } from 'firebase/firestore';
import { atom } from 'recoil';

export interface Community {
	id: string;
	creatorId: string;
	numberOfMembers: number;
	pryvacyType: 'public' | 'restricted' | 'private';
	createdAt?: Timestamp;
	imageUrl?: string;
}

export interface CommunitySnippet {
	communityId: string;
	isModerator?: boolean;
	imageUrl?: string;
}

interface CommunityState {
	mySnippets: CommunitySnippet[];
	currentCommunity?: Community;
	snippetsFetched: boolean;
}

const defaultCommunityState: CommunityState = {
	mySnippets: [],
	snippetsFetched: false,
};

export const CommunityState = atom<CommunityState>({
	key: 'communityState',
	default: defaultCommunityState,
});
