import { CommunityState } from '@/atoms/communityAtom';
import About from '@/components/Community/About';
import PageContent from '@/components/Layout/PageContent';
import NewPostForm from '@/components/Posts/NewPostForm';
import { auth } from '@/firebase/clientApp';
import useCommunityData from '@/hooks/useCommunityData';
import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilValue } from 'recoil';

const SubmitPostPage: React.FC = () => {
	const [user] = useAuthState(auth);
	// const communityStateValue = useRecoilValue(CommunityState);
	const { communityStateValue } = useCommunityData();
	console.log('COMMUNITY', communityStateValue);

	return (
		<PageContent>
			<>
				<Box p='14px 0px' borderBottom='1px solid' borderColor='white'>
					<Text>Create a post</Text>
				</Box>
				{user && (
					<NewPostForm
						user={user}
						communityImageURL={communityStateValue.currentCommunity?.imageUrl}
					/>
				)}
			</>

			<>
				{communityStateValue.currentCommunity && (
					<About communityData={communityStateValue.currentCommunity} />
				)}
			</>
		</PageContent>
	);
};
export default SubmitPostPage;
