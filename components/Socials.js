import { Button, Box, Text } from '@chakra-ui/core';
import { FaFacebook, FaGoogle, FaGithub } from 'react-icons/fa';

import { facebookLoginUrl } from 'lib/fb';

export default function Socials() {
  return (
    <Box mt={4}>
      <center>
        <Text fontSize="xl" fontWeight="medium">
          Or enter with a social
        </Text>
        <Box
          d="flex"
          flexDirection={{ base: 'column', md: 'row' }}
          justifyContent="space-around"
          alignItems="center"
          mt={4}
          align="center">
          <Button
            mb={4}
            leftIcon={<FaFacebook />}
            colorScheme="facebook"
            as="a"
            href={`${facebookLoginUrl}`}>
            Facebook
          </Button>
          {/*

                  <Button
                    mb={4}
                    leftIcon={<FaGithub />}
                    variant="outline"
                    as="a"
                    href={`${GithubLoginUrl}`}
                  >
                    Github
                  </Button>
                  <Button
                    mb={4}
                    leftIcon={<FaGoogle />}
                    colorScheme="red"
                    as="a"
                    href={`${GoogleLoginUrl}`}
                  >
                    Google
                 </Button> */}
        </Box>
      </center>
    </Box>
  );
}
