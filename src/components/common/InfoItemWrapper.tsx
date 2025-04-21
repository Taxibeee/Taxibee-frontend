import React from 'react';
import TextWrapper from './TextWrapper';
import InfoIcon from '@mui/icons-material/Info';
import FlexWrapper from './FlexWrapper';

interface InfoItemWrapperProps {
    text: string;
    size?: 'sm' | 'md';
}

const InfoItemWrapper: React.FC<InfoItemWrapperProps> = ({ text, size = 'md' }) => {
    return (
        <FlexWrapper gap="xs" direction="horizontal">
            <InfoIcon fontSize={size === 'sm' ? 'small' : 'medium'} />
            <TextWrapper text={text} size={size}/>
        </FlexWrapper>
    );
};

export default InfoItemWrapper;
