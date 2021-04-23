import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { convertToken } from "../services/services";

import { GoogleLogin, GoogleLogout } from "react-google-login";
import { Button } from "@material-ui/core";
import { useHistory, Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Header(props) {
  const classes = useStyles();
  const { loggedIn, setLoggedIn } = props;
  const history = useHistory();

  async function responseGoogle(response) {
    await convertToken(response.accessToken);
    localStorage.setItem("user", JSON.stringify(response.profileObj));
    setLoggedIn(true);
  }

  const handleLogout = () => {
    history.push("/");
    setLoggedIn(false);
    localStorage.removeItem("access_expiry");
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  };

  return (
    <div className={classes.root}>
      <AppBar
        position="static"
        style={{
          background:
            "linear-gradient(90deg, rgba(63,81,181,1) 0%, rgba(179,79,174,1) 20%, rgba(246,93,145,1) 40%, rgba(255,136,111,1) 60%, rgba(255,192,92,1) 80%, rgba(249,248,113,1) 100%)",
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            className={classes.title}
            onClick={() => history.push("/")}
          >
            Puzzle Matrix
          </Typography>

          {loggedIn ? (
            <React.Fragment>
              <Button color="inherit" to={"/entry/new"} component={Link}>
                New Puzzle
              </Button>
              <GoogleLogout
                clientId="923560283542-8qun7e5l4fuofo1n98fl3p70s3u4ufkd.apps.googleusercontent.com"
                buttonText="Logout"
                onLogoutSuccess={handleLogout}
                cookiePolicy={"single_host_origin"}
              ></GoogleLogout>
            </React.Fragment>
          ) : (
            <GoogleLogin
              clientId="923560283542-8qun7e5l4fuofo1n98fl3p70s3u4ufkd.apps.googleusercontent.com"
              buttonText="Login"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={"single_host_origin"}
            />
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
