import { Flex } from '@chakra-ui/core';

import Navbar from './Navbar';
import SiteHead from './SiteHead';

const Layout = ({ children }) => {
  return (
    <>
      <SiteHead />
      <Flex height="100vh" width="100vw" direction="column" overflow="hidden">
        <Navbar />
        {children}
      </Flex>
    </>
  );
};

export default Layout;
