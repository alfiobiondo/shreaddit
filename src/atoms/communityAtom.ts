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
