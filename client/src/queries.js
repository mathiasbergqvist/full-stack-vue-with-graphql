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
