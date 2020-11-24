import theme from '@chakra-ui/theme';
import { mode } from '@chakra-ui/theme-tools';

const styles = {
  ...theme.styles,
  global: (props) => ({
    ...theme.styles.global,
    fontFamily: 'body',
    fontWeight: 'light',
    bg: mode('white', '#131217')(props),
    color: mode('#131217', 'white')(props)
  })
};

const customTheme = {
  ...theme,
  fonts: {
    ...theme.fonts,
    body: `"Source Sans Pro",${theme.fonts.body}`,
    heading: `"Source Sans Pro",${theme.fonts.heading}`
  },
  colors: {
    ...theme.colors,
    black: '#131217'
  },
  config: {
    ...theme.config
    // useSystemColorMode: false,
    // initialColorMode: 'dark'
  },
  styles
};

export default customTheme;
