import React from "react";
import { Formik, Form, Field } from "formik";
import { ApolloConsumer } from "react-apollo";
import gql from "graphql-tag";

const actors = [
  {
    name: "Adam Driver",
    avatar:
      "https://images-na.ssl-images-amazon.com/images/M/MV5BOWViYjUzOWMtMzRkZi00MjNkLTk4M2ItMTVkMDg5MzE2ZDYyXkEyXkFqcGdeQXVyODQwNjM3NDA@._V1_UY256_CR36,0,172,256_AL_.jpg"
  },
  {
    name: "Gal Gadot",
    avatar:
      "https://images-na.ssl-images-amazon.com/images/M/MV5BMjUzZTJmZDItODRjYS00ZGRhLTg2NWQtOGE0YjJhNWVlMjNjXkEyXkFqcGdeQXVyMTg4NDI0NDM@._V1_UY256_CR42,0,172,256_AL_.jpg"
  },
  {
    name: "James Franco",
    avatar:
      "https://images-na.ssl-images-amazon.com/images/M/MV5BMjA4MzMzNDM5MF5BMl5BanBnXkFtZTgwMjQ0MDk0NDM@._V1_UX172_CR0,0,172,256_AL_.jpg"
  },
  {
    name: "Natalie Portman",
    avatar:
      "https://images-na.ssl-images-amazon.com/images/M/MV5BMTQ3ODE3Mjg1NV5BMl5BanBnXkFtZTcwNzA4ODcxNA@@._V1_UY256_CR9,0,172,256_AL_.jpg"
  },
  {
    name: "Emma Stone",
    avatar:
      "https://images-na.ssl-images-amazon.com/images/M/MV5BMjI4NjM1NDkyN15BMl5BanBnXkFtZTgwODgyNTY1MjE@._V1.._UX172_CR0,0,172,256_AL_.jpg"
  },
  {
    name: "Ryan Gosling",
    avatar:
      "https://images-na.ssl-images-amazon.com/images/M/MV5BMTQzMjkwNTQ2OF5BMl5BanBnXkFtZTgwNTQ4MTQ4MTE@._V1_UY256_CR15,0,172,256_AL_.jpg"
  },
  {
    name: "Johnny Depp",
    avatar:
      "https://images-na.ssl-images-amazon.com/images/M/MV5BMTM0ODU5Nzk2OV5BMl5BanBnXkFtZTcwMzI2ODgyNQ@@._V1_UY256_CR4,0,172,256_AL_.jpg"
  }
];

const LOG_IN_AS_GUEST = gql`
  mutation LogInAsGuest($name: String!, $avatar: String) {
    logInAsGuest(name: $name, avatar: $avatar) {
      token
    }
  }
`;

export default function Login() {
  return (
    <div>
      <h1>Login</h1>
      <ApolloConsumer>
        {client => (
          <Formik
            initialValues={actors[Math.floor(Math.random() * actors.length)]}
            onSubmit={(values, { setSubmitting }) => {
              client
                .mutate({
                  variables: values,
                  mutation: LOG_IN_AS_GUEST
                })
                .then(({ data: { logInAsGuest: { token } } }) => {
                  localStorage.setItem("token", token);
                  client.writeData({ data: { isLoggedIn: true, token } });
                })
                .catch(error => {
                  console.log(error);
                });
            }}
          >
            {({ values, errors, status, touched, isSubmitting }) => (
              <Form>
                <img
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    objectFit: "cover"
                  }}
                  src={values.avatar}
                  alt={"Avatar"}
                />
                <Field name="name" />
                <button type="submit" disabled={isSubmitting}>
                  Log in
                </button>
              </Form>
            )}
          </Formik>
        )}
      </ApolloConsumer>
    </div>
  );
}
