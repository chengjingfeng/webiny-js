// @flow
import gql from "graphql-tag";

export const deleteElement = gql`
    mutation deleteElement($id: ID!) {
        siteBuilder {
            deleteElement(id: $id) {
                error {
                    code
                    message
                }
            }
        }
    }
`;

export const updateElement = gql`
    mutation updateElement($id: ID!, $data: UpdateElementInput!) {
        siteBuilder {
            updateElement(id: $id, data: $data) {
                data {
                    id
                    name
                    type
                    category
                    content
                    preview {
                        src
                    }
                }
                error {
                    message
                }
            }
        }
    }
`;