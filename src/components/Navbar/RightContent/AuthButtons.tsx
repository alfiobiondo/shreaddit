import { authModalState } from '@/atoms/authModalAtom';
import { Button } from '@chakra-ui/react';
import React from 'react';
import { useSetRecoilState } from 'recoil';

const AuthButtons: React.FC = () => {
	const setAuthModalStae = useSetRecoilState(authModalState);
	return (
		<>
			<Button
				variant='outline'
				height='28px'
				display={{ base: 'none', sm: 'flex' }}
				width={{ base: '70px', md: '110px' }}
				me='2'
				onClick={() => setAuthModalStae({ open: true, view: 'login' })}
			>
				Log In
			</Button>
			<Button
				height='28px'
				display={{ base: 'none', sm: 'flex' }}
				width={{ base: '70px', md: '110px' }}
				me='2'
				onClick={() => setAuthModalStae({ open: true, view: 'signup' })}
			>
				Sign Up
			</Button>
		</>
	);
};
export default AuthButtons;
