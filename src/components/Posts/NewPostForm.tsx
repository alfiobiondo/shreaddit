import { Flex, Icon } from '@chakra-ui/react';
import React, { useState } from 'react';
import { BsLink45Deg, BsMic } from 'react-icons/bs';
import { IoDocumentText, IoImageOutline } from 'react-icons/io5';
import { BiPoll } from 'react-icons/bi';
import TabItem from './TabItem';
import TextInputs from './PostForm/TextInputs';
import ImageUpload from './PostForm/ImageUpload';

type NewPostFormProps = {};

const formTabs: TabItem[] = [
	{
		title: 'Post',
		icon: IoDocumentText,
	},
	{
		title: 'Images & Videos',
		icon: IoImageOutline,
	},
	{
		title: 'Link',
		icon: BsLink45Deg,
	},
	{
		title: 'Poll',
		icon: BiPoll,
	},
	{
		title: 'Talk',
		icon: BsMic,
	},
];

export type TabItem = {
	title: string;
	icon: typeof Icon.arguments;
};

const NewPostForm: React.FC<NewPostFormProps> = () => {
	const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
	const [textInputs, setTextInput] = useState({
		title: '',
		body: '',
	});
	const [selectedFile, setSelectedFile] = useState<string>();
	const [loading, setLoading] = useState(false);

	const handleCreatePost = async () => {};

	const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
		const reader = new FileReader();

		if (event.target.files?.[0]) {
			reader.readAsDataURL(event.target.files[0]);
		}

		reader.onload = (readerEvent) => {
			if (readerEvent.target?.result) {
				setSelectedFile(readerEvent.target.result as string);
			}
		};
	};

	const onTextChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const {
			target: { name, value },
		} = event;
		setTextInput((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<Flex direction='column' bg='white' borderRadius={4} mt={4}>
			<Flex width='100%'>
				{formTabs.map((item) => (
					<TabItem
						item={item}
						selected={item.title === selectedTab}
						setSelectedTab={setSelectedTab}
						key={item.title}
					/>
				))}
			</Flex>
			<Flex p={4}>
				{selectedTab === 'Post' && (
					<TextInputs
						textInputs={textInputs}
						handleCreatePost={handleCreatePost}
						onChange={onTextChange}
						loading={loading}
					/>
				)}
				{selectedTab === 'Images & Videos' && (
					<ImageUpload
						selectedFile={selectedFile}
						onSelectImage={onSelectImage}
						setSelectedTab={setSelectedTab}
						setSelectedFile={setSelectedFile}
					/>
				)}
			</Flex>
		</Flex>
	);
};
export default NewPostForm;
