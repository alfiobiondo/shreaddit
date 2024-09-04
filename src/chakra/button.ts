import { ComponentStyleConfig } from '@chakra-ui/theme';

export const Button: ComponentStyleConfig = {
	baseStyle: {
		borderRadius: '60px',
		fontSize: '10px',
		fontWeight: '700',
		_focus: {
			boxShadow: 'none',
		},
	},
	sizes: {
		sm: {
			fontSize: '8px',
		},
		md: {
			fontSize: '10px',
			// height: '28px',
		},
	},
	variants: {
		solid: {
			color: 'white', // Ensure solid variant text is white
			bg: 'blue.500',
			_hover: {
				bg: 'blue.400',
			},
		},
		outline: {
			color: 'blue.500', // Ensure outline variant text is brand.100
			border: '1px solid',
			borderColor: 'blue.500',
		},
		oauth: {
			height: '34px',
			border: '1px solid',
			borderColor: 'gray.300',
			_hover: {
				bg: 'gray.50',
			},
		},
	},
};
