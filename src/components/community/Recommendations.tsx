import { Community } from '@/atoms/communityAtom';
import { firestore } from '@/firebase/clientApp';
import useCommunityData from '@/hooks/useCommunityData';
import {
	Box,
	Button,
	Flex,
	Icon,
	Image,
	Skeleton,
	SkeletonCircle,
	Stack,
	Text,
} from '@chakra-ui/react';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import { FaReddit } from 'react-icons/fa';

const Recommendations: React.FC = () => {
	const [communities, setCommunities] = useState<Community[]>([]);
	const [loading, setLoading] = useState(false);
	const { communityStateValue, onJoinOrLeaveCommunity } = useCommunityData();

	const getCommunityRecommendations = useCallback(async () => {
		setLoading(true);
		try {
			const communityQuery = query(
				collection(firestore, 'communities'),
				orderBy('numberOfMembers', 'desc'),
				limit(5)
			);

			const communityDocs = await getDocs(communityQuery);

			const communities = communityDocs.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));

			setCommunities(communities as Community[]);
		} catch (error) {
			console.log('getCommunityRecommendations error', error);
		}
		setLoading(false);
	}, []);

	useEffect(() => {
		getCommunityRecommendations();
	}, [getCommunityRecommendations]);

	return (
		<Flex
			direction='column'
			bg='white'
			borderRadius={4}
			border='1px solid'
			borderColor='gray.300'
		>
			<Flex
				align='flex-end'
				color='white'
				p='6px 10px'
				height='70px'
				borderRadius='4px 4px 0px 0px'
				fontWeight={700}
				bgImage='url(/images/recCommsArt.png)'
				backgroundSize='cover'
				bgGradient='linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.75)), url(/images/recCommsArt.png)'
			>
				Top Communities
			</Flex>
			<Flex direction='column'>
				{loading ? (
					<Stack mt={2} p={3}>
						<Flex justify='space-between' align='center'>
							<SkeletonCircle size='10' />
							<Skeleton height='10px' width='70%' />
						</Flex>
						<Flex justify='space-between' align='center'>
							<SkeletonCircle size='10' />
							<Skeleton height='10px' width='70%' />
						</Flex>
						<Flex justify='space-between' align='center'>
							<SkeletonCircle size='10' />
							<Skeleton height='10px' width='70%' />
						</Flex>
					</Stack>
				) : (
					<>
						{communities.map((item, index) => {
							const isJoined = !!communityStateValue.mySnippets.find(
								(snippet) => snippet.communityId === item.id
							);

							return (
								<Link key={item.id} href={`/r/${item.id}`}>
									<Flex
										position='relative'
										align='center'
										fontSize='10pt'
										borderBottom='1px solid'
										borderColor='gray.200'
										p='10px 12px'
									>
										<Flex width='80%' align='center'>
											<Flex width='15%'>
												<Text>{index + 1}</Text>
											</Flex>
											<Flex align='center' width='70%'>
												{item.imageUrl ? (
													<Image
														src={item.imageUrl}
														alt='Community image'
														borderRadius='full'
														boxSize='28px'
														mr={2}
													/>
												) : (
													<Icon
														as={FaReddit}
														fontSize={30}
														color='brand.100'
														mr={2}
													/>
												)}
												<span
													style={{
														whiteSpace: 'nowrap',
														overflow: 'hidden',
														textOverflow: 'ellipsis',
													}}
												>
													{`r/${item.id}`}
												</span>
											</Flex>
										</Flex>
										<Box position='absolute' right='10px'>
											<Button
												height='22px'
												width='60px'
												fontSize='8pt'
												variant={isJoined ? 'outline' : 'solid'}
												onClick={(event) => {
													event.preventDefault();
													event.stopPropagation();
													onJoinOrLeaveCommunity(item, isJoined);
												}}
											>
												{isJoined ? 'Joined' : 'Join'}
											</Button>
										</Box>
									</Flex>
								</Link>
							);
						})}
						<Box p='10px 20px'>
							<Button height='30px' width='100%'>
								View All
							</Button>
						</Box>
					</>
				)}
			</Flex>
		</Flex>
	);
};
export default Recommendations;
