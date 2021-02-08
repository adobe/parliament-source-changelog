# parliament-source-changelog

Creates a changelog from the folder specified in the plugins options.

## Install

```shell
yarn add @adobe/parliament-source-changelog
```

## How to use

```javascript
// In your gatsby-config.js
const changelogTemplate = path.resolve(pathToTemplate);

module.exports = {
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `changelog`,
        path: `${__dirname}/path/to/changelog`,
      },
    },
    {
      resolve: `@adobe/parliament-source-changelog`,
      options: {
        template: changelogTemplate,
        path: `${__dirname}/path/to/changelog`,
      },
    },
  ],
};
```

## How to query

```graphql
{
  allHeaderTabs {
    edges {
      node {
        id
        path
        title
      }
    }
  }
}
```

## Contributing

Contributions are welcomed! Read the [Contributing Guide](./.github/CONTRIBUTING.md) for more information.

## Licensing

This project is licensed under the Apache V2 License. See [LICENSE](LICENSE) for more information.
