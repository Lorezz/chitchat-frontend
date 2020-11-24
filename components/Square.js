import { Box, Text } from '@chakra-ui/core';

const Square = ({ name, bg, color }) => {
  const getInitials = (str) => {
    const parts = str.split(' ');
    const initials = parts.map((p) => p.slice(0, 1));
    return initials.slice(0, 3);
  };
  return (
    <Box
      d="flex"
      borderWidth="1px"
      alignItems="center"
      justifyContent="center"
      w={12}
      h={12}
      mr={2}
      rounded="md"
      bg={bg}>
      <Text color={color} textTransform="uppercase">
        {getInitials(name)}
      </Text>
    </Box>
  );
};
export default Square;
