const minimatch = require('minimatch')
const path = require('path')

/**
 * Creates the fundraiser nodes
 */
const createFundraisersFromMarkdown = ({
  node,
  actions: { createNode },
  createNodeId,
  createContentDigest,
  getNode,
}) => {
  if (
    node.internal.type === 'MarkdownRemark' &&
    node.fileAbsolutePath &&
    minimatch(node.fileAbsolutePath, '**/content/blocks/fundraisers/*.md')
  ) {
    const fm = node.frontmatter
    const fileRelativePath = path.join(
      'content',
      getNode(node.parent).relativePath,
    )
    const fileName = path.parse(fileRelativePath).name

    createNode({
      name: fileName,
      title: fm.title,
      target: fm.target,
      raised: fm.raised,
      currency: fm.currency,
      abstract: fm.abstract,
      gallery: fm.gallery,
      body: node.rawMarkdownBody,
      fileRelativePath,
      id: createNodeId(`Fundraiser - ${fileName}`),
      parent: node.id,
      children: [],
      internal: {
        type: 'DAFundraiser',
        contentDigest: createContentDigest(fm),
      },
    })
  }
}

module.exports = { createFundraisersFromMarkdown }
