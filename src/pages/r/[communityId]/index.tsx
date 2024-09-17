import React from 'react';

import { GetServerSidePropsContext } from 'next';
import { firestore } from '@/firebase/clientApp';
import { doc, getDoc } from 'firebase/firestore';
import { Community } from '@/atoms/communityAtom';
import safeJsonStringify from 'safe-json-stringify';

type CommunityPageProps = {
	communityData: Community;
};

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
	return <div>WELCOME TO {communityData.id}</div>;
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
	try {
		const communityDocRef = doc(
			firestore,
			'communities',
			context.query.communityId as string
		);

		const communityDoc = await getDoc(communityDocRef);

		return {
			props: {
				communityData: JSON.parse(
					safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() })
				),
			},
		};
	} catch (error) {
		// Could add error page here
		console.log('getServerSideProps error', error);
	}
}

export default CommunityPage;