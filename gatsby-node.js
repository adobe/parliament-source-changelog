/**
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
const glob = require("glob");

let changelogTemplate = null;
let changelogPath = null;

exports.onPreInit = (_, { template, path }) => {
  // Setup options
  changelogTemplate = template;
  changelogPath = path;
};

exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions;

  const result = await graphql(`
    {
      allMarkdownRemark(
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
        filter: {
          fileAbsolutePath: {
            glob: "${changelogPath}/**"
          }
        }
      ) {
        edges {
          node {
            frontmatter {
              slug
              title
            }
          }
        }
      }
    }
  `);
  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }

  const pages = result.data.allMarkdownRemark.edges.map(({ node }) => {
    return { title: node.frontmatter.title, path: node.frontmatter.slug };
  });

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.frontmatter.slug,
      component: changelogTemplate,
      context: {
        slug: node.frontmatter.slug,
        selectedKey: node.frontmatter.title,
        pages,
      },
    });
  });

  if (result.data.allMarkdownRemark.edges[0]) {
    const changelog = result.data.allMarkdownRemark.edges[0].node;

    createPage({
      path: "/changelog",
      component: changelogTemplate,
      context: {
        slug: changelog.frontmatter.slug,
        selectedKey: changelog.frontmatter.title,
        pages,
      },
    });
  }
};

const HEADER_TAB_TYPE = `HeaderTabs`;
exports.sourceNodes = async ({
  actions,
  createContentDigest,
  createNodeId,
  getNodesByType,
}) => {
  const { createNode } = actions;

  const changelogFiles = glob.sync(`${changelogPath}/**`);
  if (changelogFiles.length > 0) {
    const data = { title: "Changelog", path: "/changelog" };

    createNode({
      ...data,
      id: createNodeId(`${HEADER_TAB_TYPE}-${data.title}`),
      parent: null,
      children: [],
      internal: {
        type: HEADER_TAB_TYPE,
        content: JSON.stringify(data),
        contentDigest: createContentDigest(data),
      },
    });
  }
  return;
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
      type HeaderTabs implements Node @dontInfer {
        id: ID!
        title: String!
        path: String!
      }
    `;
  createTypes(typeDefs);
};
