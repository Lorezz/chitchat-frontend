import { Flex } from '@chakra-ui/core';
import Link from 'next/link';

import Navbar from './Navbar';
import SiteHead from './SiteHead';

const Policy = () => (
  <div className="policyLink">
    <center>
      <Link href="/policy">
        <a>Privacy-Policy</a>
      </Link>
    </center>
  </div>
);

const Layout = ({ children }) => {
  return (
    <>
      <SiteHead />
      <Flex height="100vh" width="100vw" direction="column" overflow="hidden">
        <Navbar />
        {children}
        <Policy />
      </Flex>
    </>
  );
};

export default Layout;
