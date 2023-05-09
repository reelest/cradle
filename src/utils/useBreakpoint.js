import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function useBreakpoint(breakpoint = "xs") {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down(breakpoint));
}
