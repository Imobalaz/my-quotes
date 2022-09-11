import Card from "../UI/Card";
import classes from "./AuthForm.module.css";
import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import LoadingSpinner from "../UI/LoadingSpinner";
import useInput from "../../hooks/use-input";
import AuthContext from "../../store/auth-context";

const API_KEY = "AIzaSyBX3OF7xMb8Ifk7BLxlsqdOQxdRb21sFgk";

const AuthForm = () => {
  const authCtx = useContext(AuthContext);
  const history = useHistory();
  const emailValidation = (value) => {
    return value.trim().length && value.includes("@") && value.includes(".");
  };

  const passwordValidation = (value) => {
    return value.trim().length >= 8;
  };
  const {
    value: emailValue,
    setIsTouched: setEmailIsTouched,
    valueIsValid: emailIsValid,
    hasError: emailHasError,
    inputBlurHandler: emailInputBlurHandler,
    valueChangeHandler: emailValueChangeHandler,
    reset: emailReset,
  } = useInput(emailValidation);

  const {
    value: passwordValue,
    setIsTouched: setPasswordIsTouched,
    valueIsValid: passwordIsValid,
    hasError: passwordHasError,
    inputBlurHandler: passwordInputBlurHandler,
    valueChangeHandler: passwordValueChangeHandler,
    reset: passwordReset,
  } = useInput(passwordValidation);

  const {
    value: confirmPasswordValue,
    setIsTouched: setConfirmPasswordIsTouched,
    inputBlurHandler: confirmPasswordInputBlurHandler,
    valueChangeHandler: confirmPasswordValueChangeHandler,
    reset: confirmPasswordReset,
  } = useInput(passwordValidation);

  const [isLogin, setIsLogin] = useState(true);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const title = isLogin ? "Login" : "Sign Up";

  const switchAuthModeHandler = () => {
    setIsLogin((prev) => !prev);
    setEmailIsTouched(false)
    setPasswordIsTouched(false)
  };

  const formSubmitHandler = (event) => {
    event.preventDefault();
    setEmailIsTouched(true);
    setPasswordIsTouched(true);
    

    if (!isLogin) {
      if (passwordValue === confirmPasswordValue) {
        setPasswordsMatch(true);
      } else {
        setPasswordsMatch(false);
        return;
      }
    }


    const formIsValid = emailIsValid && passwordIsValid;

    if (!formIsValid) {
      return;
    }

    const enteredEmail = emailValue;
    const enteredPassword = passwordValue;

    let url;
    if (isLogin) {
      url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
    } else {
      url =
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
    }
    setIsLoading(true)
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail,
        password: enteredPassword,
        returnSecureToken: true
      }),
      headers: {
        'Content-Type' : 'application/json'
      }
    }).then(res => {
      setIsLoading(false)
      if(res.ok) {
        return res.json();
      } else {
        return res.json().then(data => {
          let errorMessage = "Authentication Failed";
          console.log(data);
          if (data && data.error && data.error.message) {
            errorMessage = data.error.message;
          }

          throw new Error(errorMessage);
        })
      }
    }).then(data => {
      emailReset();
      passwordReset();
      confirmPasswordReset();
      const expirationTime = new Date(new Date().getTime() + (+data.expiresIn * 1000))
      authCtx.login(data.idToken, expirationTime.toISOString())
      history.replace('/')
    }).catch(err => {
      
      alert(err.message)
    })

    


  };

  const emailClass = `${classes.control} ${
    emailHasError ? classes.invalid : ""
  }`;

  const passwordClass = `${classes.control} ${
    passwordHasError || !passwordsMatch ? classes.invalid : ""
  }`;

  const passwordErrorText = passwordHasError
    ? "Password must be at least 8 characters"
    : "Passwords do not match";

  return (
    <Card>
      <section className={classes.auth}>
        <h1>{title}</h1>
        <form onSubmit={formSubmitHandler}>
          <div className={emailClass}>
            <label htmlFor="email">Your Email*</label>
            <input
              value={emailValue}
              onChange={emailValueChangeHandler}
              onBlur={emailInputBlurHandler}
              type="email"
              id="email"
              required
            />
            {emailHasError && <p className="error-text">Input a valid email</p>}
          </div>
          <div className={passwordClass}>
            <label htmlFor="password">Your Password*</label>
            <input
              onChange={passwordValueChangeHandler}
              onBlur={passwordInputBlurHandler}
              value={passwordValue}
              type="password"
              id="password"
              required
            />
            {passwordHasError && (
              <p className="error-text">{passwordErrorText}</p>
            )}
            {!passwordHasError && !passwordsMatch && (
              <p className="error-text">{passwordErrorText}</p>
            )}
          </div>
          {!isLogin && !isLoading && (
            <div className={classes.control}>
              <label htmlFor="confirmPassword">Confirm Your Password</label>
              <input
                type="password"
                value={confirmPasswordValue}
                onBlur={confirmPasswordInputBlurHandler}
                onChange={confirmPasswordValueChangeHandler}
                id="confirmPassword"
                required
              />
            </div>
          )}
          {!isLoading && <div className={classes.actions}>
            <button type="button" onClick={formSubmitHandler}>
              {isLogin ? "Login" : "Create new account"}
            </button>
            <button type="button" onClick={switchAuthModeHandler}>
              {isLogin ? "Create a new account" : "Login with existing account"}
            </button>
          </div>}
          {isLoading && <LoadingSpinner />}
        </form>
      </section>
    </Card>
  );
};

export default AuthForm;
