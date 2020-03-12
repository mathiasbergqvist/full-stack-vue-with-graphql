import gql from "graphql-tag";

/** POST QUERIES */
export const GET_POSTS = gql`
  query {
    getPosts {
      _id
      title
      imageUrl
      description
      likes
    }
  }
`;

/** USER QUERIES */

/** POST MUTATIONS */

/** USER MUTATIONS */
export const SIGNIN_USER = gql`
  mutation($username: String!, $password: String!) {
    signinUser(username: $username, password: $password) {
      token
    }
  }
`;

export const SIGNUP_USER = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    signupUser(username: $username, password: $password, email: $email) {
      token
    }
  }
`;
