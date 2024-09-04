import { Flex, Image } from '@chakra-ui/react';
import React from 'react';
import SearchInput from './SearchInput';
import RightContent from './RightContent/RightContent';

const Navbar: React.FC = () => {
	return (
		<Flex bg='white' height='44px' padding='6px 16px'>
			<Flex align='center'>
				<Image
					src='/images/redditFace.svg'
					alt='reddit logo image'
					height='30px'
				/>
				<Image
					src='/images/shredditText.svg'
					alt='reddit logo text'
					height='46px'
					display={{ base: 'none', md: 'unset' }}
				/>
			</Flex>
			<SearchInput />
			<RightContent />
			{/* 			<Directory/>
			 */}
		</Flex>
	);
};
export default Navbar;
