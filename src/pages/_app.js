// pages/_app.js

import { ThemeProvider } from "@mui/material/styles";
import '../Scss/main.scss'; 
import { CssBaseline } from '@mui/material'; 
import { createCustomTheme } from "../../src/Themes/index";

function MyApp({ Component, pageProps }) {
  const theme = createCustomTheme();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
      </ThemeProvider>
  );
}

export default MyApp;
