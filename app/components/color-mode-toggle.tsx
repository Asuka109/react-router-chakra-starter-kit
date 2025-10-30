import { IconButton, type IconButtonProps } from '@chakra-ui/react';
import { useTheme } from 'next-themes';
import type { MouseEvent } from 'react';
import { LuMoon, LuSun } from 'react-icons/lu';

export function ColorModeToggle(props: IconButtonProps) {
  const { onClick, ...rest } = props;

  const { theme, setTheme } = useTheme();
  const toggleColorMode = (e: MouseEvent<HTMLButtonElement>) => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    onClick?.(e);
  };

  return (
    <IconButton
      aria-label="toggle color mode"
      variant="outline"
      onClick={toggleColorMode}
      {...rest}
    >
      {theme === 'light' ? <LuMoon /> : <LuSun />}
    </IconButton>
  );
}
