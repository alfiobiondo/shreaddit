import { CommunityState } from '@/atoms/communityAtom';
import {
	DirectoryMenuItem,
	directoryMenuState,
} from '@/atoms/directoryMenuAtom';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { FaReddit } from 'react-icons/fa';
import { useRecoilState, useRecoilValue } from 'recoil';

const useDirectory = () => {
	const [directoryState, setDirectoryState] =
		useRecoilState(directoryMenuState);
	const communityStateValue = useRecoilValue(CommunityState);

	const router = useRouter();

	const onSelectMenuItem = (menuItem: DirectoryMenuItem) => {
		setDirectoryState((prev) => ({
			...prev,
			selectedMenuItem: menuItem,
		}));

		router.push(menuItem.link);

		if (directoryState.isOpen) {
			toggleMenuOpen();
		}
	};

	useEffect(() => {
		const { currentCommunity } = communityStateValue;

		if (currentCommunity) {
			setDirectoryState((prev) => ({
				...prev,
				selectedMenuItem: {
					displayText: `r/${currentCommunity.id}`,
					link: `/r/${currentCommunity.id}`,
					icon: FaReddit,
					iconColor: 'blue.500',
					imageURL: currentCommunity.imageUrl,
				},
			}));
		}
	}, [communityStateValue, setDirectoryState]);

	const toggleMenuOpen = () => {
		setDirectoryState((prev) => ({ ...prev, isOpen: !directoryState.isOpen }));
	};

	return { directoryState, toggleMenuOpen, onSelectMenuItem };
};
export default useDirectory;
