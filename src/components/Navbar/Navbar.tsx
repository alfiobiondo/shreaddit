import { Flex, Image } from '@chakra-ui/react';
import React from 'react';

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
					src='/images/redditText.svg'
					alt='reddit logo text'
					height='46px'
					display={{ base: 'none', md: 'unset' }}
				/>
			</Flex>
		</Flex>
	);
};
export default Navbar;
