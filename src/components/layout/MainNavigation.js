import classes from "./MainNavigation.module.css";
import { NavLink, Link, useHistory } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import AuthContext from "../../store/auth-context";

const MainNavigation = () => {
  const authCtx = useContext(AuthContext);
  const history = useHistory()
  const [windowWidth, setWindowWidth] = useState(undefined);
  const [hamburgerIsActive, setHamburgerIsActive] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
  }, []);
  const hamburgerToggler = () => {
    setHamburgerIsActive((prev) => !prev);
  };
  const logoutHandler = () => {
    authCtx.logout();
    setHamburgerIsActive(false);
    history.replace('/')
  };
  const hamburgerClass = `${classes.hamburger} ${
    hamburgerIsActive ? classes.active : ""
  }`;
  const navClass = `${classes.nav} ${hamburgerIsActive ? classes.active : ""}`;
  return (
    <>
      {hamburgerIsActive && (
        <div onClick={hamburgerToggler} className={classes.overlay}></div>
      )}
      <header className={classes.header}>
        <div className={classes.logo}>
          <NavLink to="/quotes">Great Quotes</NavLink>
        </div>
        <nav className={navClass}>
          {authCtx.userIsLoggedIn && (
            <ul>
              <li onClick={hamburgerToggler}>
                <NavLink to="/quotes" activeClassName={classes.active}>
                  All Quotes
                </NavLink>
              </li>
              <li onClick={hamburgerToggler}>
                <NavLink to="/new-quote" activeClassName={classes.active}>
                  Add a Quote
                </NavLink>
              </li>
              <li>
                {windowWidth >= 600 && (
                  <button onClick={logoutHandler}>Logout</button>
                )}
                {windowWidth < 600 && (
                  <a onClick={logoutHandler} href="#">
                    Logout
                  </a>
                )}
              </li>
            </ul>
          )}
          {!authCtx.userIsLoggedIn && (
            <div className={classes.login} onClick={hamburgerToggler}>
              <NavLink to="/auth" activeClassName={classes.active}>
                Login
              </NavLink>
            </div>
          )}
        </nav>
        {authCtx.userIsLoggedIn && (
          <div className={hamburgerClass} onClick={hamburgerToggler}>
            <div className={classes.bar}></div>
            <div className={classes.bar}></div>
            <div className={classes.bar}></div>
          </div>
        )}
      </header>
    </>
  );
};

export default MainNavigation;
