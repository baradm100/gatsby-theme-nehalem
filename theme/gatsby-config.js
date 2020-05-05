module.exports = (themeOptions) => {
    const loadDefaultPages =
        themeOptions.loadDefaultPages !== undefined
            ? themeOptions.loadDefaultPages
            : true;
    const contentPath = themeOptions.contentPath || 'content';
    const manifest = themeOptions.manifest
        ? themeOptions.manifest
        : {
              name: `admonation - A Gatsby theme`,
              short_name: `admonation`,
              start_url: `/`,
              background_color: `#a4cbb8`,
              theme_color: `#a4cbb8`,
              display: `minimal-ui`,
              icon: `${__dirname}/assets/logo.png`,
          };

    return {
        siteMetadata: {
            title: `admonation`,
            siteUrl: `https://nehalem.netlify.com`, // TODO: Rename
            description: `A Gatsby theme for %TOPICS%`,
            topics: [`bloggers`, `geeks`, `nerds`, `people`, `everyone`],
            menu: [
                {
                    name: 'Home',
                    path: '/',
                },
                {
                    name: 'Archive',
                    path: '/archive',
                },
                {
                    name: 'Tags',
                    path: '/tags',
                },
            ],
            footerMenu: [
                {
                    name: 'RSS',
                    path: '/rss.xml',
                },
                {
                    name: 'Sitemap',
                    path: '/sitemap.xml',
                },
            ],
            search: true,
            showFeaturedTags: true,
            author: {
                name: `baradm100`,
                description: `I'm <strong>admonation</strong>, a Gatsby theme by 
        <a href="https://github.com/baradm100" rel="noopener" target="_blank">Bar Admoni</a>. If you like what you see feel free to give a 
        <a href="https://github.com/baradm100/gatsby-theme-admonation" rel="noopener" target="_blank">star on GitHub!</a>`,
                social: {
                    facebook: ``,
                    twitter: ``,
                    linkedin: `https://www.linkedin.com/in/bar-admoni/`,
                    instagram: ``,
                    youtube: ``,
                    github: `https://github.com/baradm100`,
                    twitch: ``,
                },
            },
        },
        plugins: [
            `gatsby-plugin-typescript`,
            `gatsby-transformer-sharp`,
            `gatsby-plugin-react-helmet`,
            `gatsby-plugin-styled-components`,
            `gatsby-plugin-sitemap`,
            `gatsby-plugin-sharp`,
            {
                resolve: `gatsby-plugin-manifest`,
                options: manifest,
            },
            {
                resolve: `gatsby-source-filesystem`,
                options: {
                    name: 'content',
                    path: contentPath,
                },
            },
            {
                resolve: `gatsby-source-filesystem`,
                options: {
                    name: `themeAssets`,
                    path: `${__dirname}/assets`,
                },
            },
            {
                resolve: `gatsby-transformer-yaml`,
                options: {
                    typeName: `Tags`,
                },
            },
            {
                resolve: `gatsby-plugin-lunr`,
                options: {
                    languages: [
                        {
                            name: 'en',
                        },
                    ],
                    fields: [
                        {
                            name: 'title',
                            store: true,
                            attributes: { boost: 20 },
                        },
                        { name: 'content', store: true },
                        { name: 'tags', store: true },
                        { name: 'excerpt', store: true },
                        { name: 'path', store: true },
                    ],
                    resolvers: {
                        MarkdownRemark: {
                            title: (node) => node.frontmatter.title,
                            content: (node) => node.html,
                            tags: (node) => node.frontmatter.tags,
                            excerpt: (node) => node.frontmatter.excerpt,
                            path: (node) => node.frontmatter.path,
                        },
                    },
                },
            },
            {
                resolve: `gatsby-transformer-remark`,
                options: {
                    plugins: [
                        `gatsby-remark-autolink-headers`,
                        `gatsby-remark-prismjs`,
                        {
                            resolve: `gatsby-remark-images`,
                            options: {
                                maxWidth: 1200,
                            },
                        },
                    ],
                },
            },
            loadDefaultPages && {
                resolve: `gatsby-plugin-page-creator`,
                options: {
                    path: `${__dirname}/src/pages`,
                },
            },
            {
                resolve: `gatsby-plugin-feed`,
                options: {
                    query: `
            {
              site {
                siteMetadata {
                  title
                  description
                  siteUrl
                  site_url: siteUrl
                }
              }
            }
          `,
                    feeds: [
                        {
                            serialize: ({
                                query: { site, allMarkdownRemark },
                            }) => {
                                return allMarkdownRemark.edges.map((edge) => {
                                    return Object.assign(
                                        {},
                                        edge.node.frontmatter,
                                        {
                                            description:
                                                edge.node.frontmatter.excerpt,
                                            date: edge.node.frontmatter.created,
                                            url:
                                                site.siteMetadata.siteUrl +
                                                edge.node.frontmatter.path,
                                            guid:
                                                site.siteMetadata.siteUrl +
                                                edge.node.frontmatter.path,
                                            custom_elements: [
                                                {
                                                    'content:encoded':
                                                        edge.node.html,
                                                },
                                            ],
                                        }
                                    );
                                });
                            },
                            query: `
              {
                allMarkdownRemark(
                  sort: { order: DESC, fields: [frontmatter___created] },
                  filter: { fileAbsolutePath: { regex: "/(posts)/.*\\\\.md$/" } }
                ) {
                  edges {
                    node {
                      html
                      frontmatter {
                        title
                        excerpt
                        path
                        created
                      }
                    }
                  }
                }
              }
              `,
                            output: `/rss.xml`,
                            title: `RSS Feed`,
                        },
                    ],
                },
            },
            {
                resolve: `gatsby-plugin-offline`,
                options: {
                    precachePages: [`/`, `/archive`],
                },
            },
            {
                resolve: 'gatsby-plugin-robots-txt',
            },
            {
                resolve: 'gatsby-plugin-preload-link-crossorigin',
            },
        ].filter(Boolean),
    };
};
