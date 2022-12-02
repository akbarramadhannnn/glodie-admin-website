import React, { useCallback, useState } from "react";
import { Redirect } from "react-router-dom";
import {
  Alert,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Label,
  Input,
  InputGroup,
} from "reactstrap";
import { ApiLogin } from "../../api/auth";
// import images
import profile from "../../assets/images/profile-img.png";
// import logo from "../../assets/images/logo.svg";
// import lightlogo from "../../assets/images/logo-light.svg";
import { useDispatch, useSelector } from "react-redux";
import { LOAD_AUTH } from "../../store/auth/actionTypes";
import { loadAuthAction } from "../../store/auth/actions";

const Login = ({ location }) => {
  const dispatch = useDispatch();
  const selectorAuth = useSelector(({ Auth }) => Auth);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeInput = useCallback(e => {
    const { name, value } = e.target;

    if (name === "username") {
      setUsername(value);
    }

    if (name === "password") {
      setPassword(value);
    }

    setError("");
  }, []);

  const handleLogin = useCallback(
    e => {
      e.preventDefault();
      if (!username) {
        setError("Username wajib diisi");
        return;
      }

      if (!password) {
        setError("Password wajib diisi");
        return;
      }
      setIsLoading(true);
      const payload = {
        username,
        password,
      };
      ApiLogin(payload).then(response => {
        if (response.status === 400) {
          setError(response.message);
        }

        if (response.status === 200) {
          localStorage.setItem("token", response.result.token);
          dispatch(loadAuthAction());
        }
        setIsLoading(false);
      });
    },
    [username, password, dispatch]
  );

  if (selectorAuth.isAuth === true) {
    if (location.state === undefined) {
      return <Redirect to={"/dashboard"} />;
    }

    if (location.state.from.pathname) {
      return <Redirect to={location.state.from.pathname} />;
    }
  }

  return (
    <div className="account-pages my-5 pt-sm-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <Card className="overflow-hidden">
              <div className="bg-primary bg-soft">
                <Row>
                  <Col className="col-7">
                    {/* <div className="text-primary p-4">
                      <h5 className="text-primary">Welcome Back !</h5>
                      <p>Sign in to continue to Skote.</p>
                    </div> */}
                  </Col>
                  <Col className="col-5 align-self-end">
                    <img src={profile} alt="" className="img-fluid" />
                  </Col>
                </Row>
              </div>
              <CardBody>
                {/* <div className="auth-logo">
                  <Link to="/" className="auth-logo-light">
                    <div className="avatar-md profile-user-wid mb-4">
                      <span className="avatar-title rounded-circle bg-light">
                        <img
                          src={lightlogo}
                          alt=""
                          className="rounded-circle"
                          height="34"
                        />
                      </span>
                    </div>
                  </Link>
                  <Link to="/" className="auth-logo-dark">
                    <div className="avatar-md profile-user-wid mb-4">
                      <span className="avatar-title rounded-circle bg-light">
                        <img
                          src={logo}
                          alt=""
                          className="rounded-circle"
                          height="34"
                        />
                      </span>
                    </div>
                  </Link>
                </div> */}

                <div className="p-2">
                  {error && <Alert color="danger">{error}</Alert>}

                  <div className="mb-4 mt-4">
                    <Label className="visually-hidden">Username</Label>
                    <InputGroup>
                      <div className="input-group-text">
                        <i className="bx bx-user" />
                      </div>
                      <Input
                        value={username}
                        name="username"
                        type="text"
                        placeholder="Username atau Email"
                        onChange={handleChangeInput}
                        disabled={isLoading}
                      />
                    </InputGroup>
                  </div>

                  <div className="mb-4">
                    <div className="input-group auth-pass-inputgroup">
                      <Label className="visually-hidden">Password</Label>
                      <InputGroup>
                        <div className="input-group-text">
                          <i className="bx bx-key" />
                        </div>
                        <Input
                          value={password}
                          name="password"
                          type={isShowPassword ? "text" : "password"}
                          placeholder="Password"
                          onChange={handleChangeInput}
                          disabled={isLoading}
                        />
                        <div className="input-group-text">
                          <i
                            className={` ${
                              isShowPassword ? "bx bx-show" : "bx bx-hide"
                            }`}
                            onClick={e => {
                              e.preventDefault();
                              setIsShowPassword(oldState => !oldState);
                            }}
                            style={{
                              cursor: "pointer",
                            }}
                          />
                        </div>
                      </InputGroup>
                    </div>
                  </div>
                  <div className="mt-3 d-grid">
                    <button
                      className="btn btn-primary btn-block"
                      onClick={handleLogin}
                      disabled={isLoading}
                    >
                      Log In
                    </button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
