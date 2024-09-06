import { authModalState } from '@/atoms/authModalAtom';
import { Flex } from '@chakra-ui/react';
import React from 'react';
import { useRecoilValue } from 'recoil';
import Login from './Login';
import SignUp from './SignUp';

type AuthInputsProps = {};

const AuthInputs: React.FC<AuthInputsProps> = () => {
	const modalStateValue = useRecoilValue(authModalState);

	return (
		<Flex direction='column' align='center' width='100%' mt={4}>
			{modalStateValue.view === 'login' && <Login />}
			{modalStateValue.view === 'signup' && <SignUp />}
		</Flex>
	);
};
export default AuthInputs;
