import { useContext } from 'react';
import Link from 'next/link';

import {
  Box,
  Text,
  useColorMode,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useBreakpointValue
} from '@chakra-ui/core';

import {
  MdWbSunny,
  MdBrightness3,
  MdMoreVert,
  MdChat,
  MdAccountBox,
  MdHome,
  MdExitToApp,
  MdClose
} from 'react-icons/md';

import { AuthContext, reset } from 'lib/AuthContext';
import { getGravatarUrl } from 'lib/gravatar';
import { signOut } from 'lib/api';

const Nav = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { state, dispatch } = useContext(AuthContext);
  const user = state?.auth?.user;
  const isSM = useBreakpointValue({ base: true, md: false });

  const logout = async () => {
    try {
      const token = state?.auth?.token;
      if (token) await signOut(token);
    } catch (e) {
      console.log(e);
    }
    dispatch(reset());
  };

  return (
    <Box
      d="flex"
      justifyContent="space-between"
      boxShadow="base"
      p="1"
      zIndex={2}>
      <Box d="flex" alignItems="center">
        <Link href="/">
          <a>
            <Box
              as="img"
              loading="lazy"
              title="ChitChat by Lorezz"
              src="/logo.png"
              height={[10, 50]}
              borderRadius="50%"
              mx={2}
              style={{ border: '2px solid skyblue' }}
            />
          </a>
        </Link>
        <Text ml="1" fontWeight="bold">
          ChitChat
        </Text>
      </Box>
      <Box d="flex" alignItems="center">
        {colorMode === 'light' ? (
          <MdBrightness3 size={24} onClick={toggleColorMode} />
        ) : (
          <MdWbSunny size={24} onClick={toggleColorMode} />
        )}
      </Box>
      <Box d="flex" alignItems="center" mx={4}>
        {user && (
          <>
            <Text margin="1" fontWeight="bold" hidden={isSM ? true : false}>
              {user.nick}
            </Text>
            <Avatar
              showBorder
              name={user.nick}
              src={user.pic ? user.pic : getGravatarUrl(user.email)}
            />
            <Menu>
              <MenuButton>
                <MdMoreVert size={24} />
              </MenuButton>
              <MenuList>
                <MenuItem
                  icon={<MdExitToApp size={24} />}
                  onClick={() => logout()}>
                  Logout
                </MenuItem>
                <MenuItem icon={<MdHome size={24} />}>Home</MenuItem>
                <MenuItem icon={<MdChat size={24} />}>Chat</MenuItem>
                <MenuItem icon={<MdAccountBox size={24} />}>Profile</MenuItem>
                <MenuDivider />
                <MenuItem icon={<MdClose size={24} />}>close</MenuItem>
              </MenuList>
            </Menu>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Nav;
