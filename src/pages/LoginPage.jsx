import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { PasswordField } from "../components/Login/PasswordField";
import { redirect, Link as RLink, useNavigate } from "react-router-dom";
import { useEffect, useReducer } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useAuthStore } from "../store/authStore";

const LoginPage = () => {
  const navigate = useNavigate();
  const { token, setToken } = useAuthStore();
  const reducer = (state, action) => {
    switch (action.type) {
      case "changed_email":
        return {
          email: action.nextEmail,
          password: state.password,
        };
      case "changed_password":
        return {
          email: state.email,
          password: action.nextPassword,
        };
    }
  };
  const [state, dispatch] = useReducer(reducer, {
    email: "",
    password: "",
  });

  useEffect(() => {
    if (token === null) {
      navigate("/login");
    }
  }, []);

  const handleLogin = () => {
    // perform check on empty email/password
    if (state.email === "" || state.password === "") {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Email and/or password cannot be empty",
        confirmButtonColor: "#262626",
      });
      return;
    }

    // login account
    // register account
    axios
      .post(`${import.meta.env.VITE_AUTH_ENDPOINT}/login`, state)
      .then((res) => {
        // console.log(res.data["bearer_token"]);
        let token = { ...res.data };
        token["email"] = state.email;
        setToken(token);
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: `You are currently logged in.`,
          confirmButtonColor: "#262626",
        }).then((result) => {
          window.location.replace("/products");
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Unable to login. Please ensure your login credentials are correct.",
          confirmButtonColor: "#262626",
        });
        return;
      });
  };

  return (
    <Box h="calc(100vh - 100px)" p="24">
      <Container
        maxW="xl"
        py={{
          base: "12",
          md: "16",
        }}
        px={{
          base: "0",
          sm: "8",
          md: "16",
        }}>
        <Stack spacing="8">
          <Stack spacing="6">
            <Stack
              spacing={{
                base: "2",
                md: "3",
              }}>
              <Heading textAlign={"left"} size={"2xl"}>
                LOGIN
              </Heading>
              <HStack spacing="1">
                <Text color="muted">Don't have an account?</Text>
                <Button
                  as={RLink}
                  to="/register"
                  variant="link"
                  colorScheme="blue">
                  Sign up
                </Button>
              </HStack>
            </Stack>
          </Stack>
          <Box>
            <Stack spacing="6">
              <Stack spacing="5">
                <FormControl>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    id="email"
                    type="email"
                    onChange={(e) => {
                      dispatch({
                        type: "changed_email",
                        nextEmail: e.target.value,
                      });
                    }}
                  />
                </FormControl>
                <PasswordField
                  onChange={(e) => {
                    dispatch({
                      type: "changed_password",
                      nextPassword: e.target.value,
                    });
                  }}
                />
              </Stack>
              <Stack spacing="6">
                <Button colorScheme="teal" onClick={handleLogin}>
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default LoginPage;
