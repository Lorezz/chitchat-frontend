import { Box, Text, Avatar } from '@chakra-ui/core';
import moment from 'moment';
import { isIE, isSafari } from 'react-device-detect';

const Message = ({ data }) => {
  const { createdAt, text, _id, user, pic, audio } = data;
  let audioNotSupported = false;
  let audioType = 'webm';
  if (audio) {
    console.log('audio  ', audio);
    audioNotSupported = isIE || isSafari;
    const parts = audio.split('.');
    console.log('audio type', audioType);
    if (parts && parts.length > 0) audioType = parts[parts.length - 1];
  }

  return (
    <Box d="flex" key={_id} p={1} mb={3}>
      <Box flexShrink="0">
        <Avatar src={user?.pic} name={user?.nick} />
      </Box>

      <Box d="flex" flexDirection="column">
        <Box d="flex" flexDirection="column-reverse">
          <Text
            fontWeight="bold"
            lineHeight="tight"
            textTransform="capitalize"
            mr="2">
            {`@${user?.nick}`}
          </Text>
          <Text
            lineHeight="tight"
            color="gray.600"
            fontSize="small"
            color="gray.400">
            {moment(createdAt).calendar()}
          </Text>
        </Box>
        {audio && (
          <Box style={{ margin: '30px 0' }}>
            <audio controls>
              <source src={audio} type={`audio/${audioType}`} />
              <p>
                Your browser doesn't support HTML5 audio. Here is a
                <a href={audio}>link to the audio</a> instead.
              </p>
            </audio>
            {audioNotSupported && (
              <Text>Your browser doesn't support this audio format</Text>
            )}
          </Box>
        )}
        {pic && (
          <img
            src={pic}
            width="240px"
            loading="lazy"
            style={{ margin: '30px 0' }}
          />
        )}
        {text && <Text lineHeight="tight">{text}</Text>}
      </Box>
    </Box>
  );
};
export default Message;
