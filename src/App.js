import { Box, CssBaseline } from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { unstable_createMuiStrictModeTheme as createMuiTheme } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import React, { useEffect, useState } from "react";

import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import Header from "./components/Header";
import Puzzle from "./components/Puzzle";
import PuzzleEntry from "./components/PuzzleEntry";
import PuzzleList from "./components/PuzzleList";
const theme = createMuiTheme({
  palette: {
    gradient: {
      a: { main: "#3F51B5", light: "#9ca6dc" },
      b: { main: "#B34FAE", light: "#d9a7d6" },
      c: { main: "#F65D91", light: "#faadc7" },
      d: { main: "#FF886F", light: "#ffc3b7" },
      e: { main: "#FFC05C", light: "#ffdfad" },
      f: { main: "#F9F871", light: "#fcfbb7" },
    },
    background: {
      default: "#F9F8FF",
    },
  },
});

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState();

  useEffect(() => {
    if (localStorage.getItem("user")) {
      // hit user endpoint
      setUser(JSON.parse(localStorage.getItem("user")));
      setLoggedIn(true);
    }
  }, []);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Switch>
          <Route path="/login">Hi</Route>
          <React.Fragment>
            <Header
              loggedIn={loggedIn}
              setLoggedIn={setLoggedIn}
              user={user}
              setUser={setUser}
            ></Header>
            <Container>
              <Box mt={4}>
                <Route path="/entry/:puzzleId">
                  {loggedIn ? <PuzzleEntry /> : <Redirect to="/" />}
                </Route>
                <Route path="/puzzle/:puzzleId">
                  <Puzzle />
                </Route>
                <Route exact path="/">
                  <PuzzleList />
                </Route>
              </Box>
            </Container>
          </React.Fragment>
        </Switch>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
