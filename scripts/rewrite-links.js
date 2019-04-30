/**
 * Before we publish to npm, we want to rewrite all relative links inside markdown files to
 * absolute github paths, so that documentation hosted on npmjs.com never contains broken links.
 */

const fs = require('fs');
const path = require('path');

const rewriteLinksConfig = {
  githubPath: 'https://github.com/ing-bank/lion/blob/master/',
  monorepoRootPath: path.resolve(__dirname, '../'),
};

const gatherFilesConfig = {
  extension: '.md',
  excludeFiles: ['CHANGELOG.md'],
  excludeFolders: ['node_modules', '.history'],
};

/**
 * Gets an array of files for given extension
 * @param {string} startPath - local filesystem path
 * @param {object} cfg - configuration object
 * @param {string} cfg.extension - file extension like '.md'
 * @param {array} cfg.excludeFiles - file names filtered out
 * @param {array} cfg.excludeFolders - folder names filtered out
 * @param {array} result - list of file paths
 * @returns {array} result list of file paths
 */
function gatherFilesFromDir(startPath, cfg = gatherFilesConfig, result = []) {
  const files = fs.readdirSync(startPath);
  files.forEach(file => {
    const filePath = path.join(startPath, file);
    const stat = fs.lstatSync(filePath);
    if (stat.isDirectory()) {
      const folderName = filePath.replace(/.*\/([^/]+)$/, '$1');
      if (!cfg.excludeFolders.includes(folderName)) {
        gatherFilesFromDir(filePath, cfg, result); // search recursively
      }
    } else if (filePath.endsWith(cfg.extension)) {
      const fileName = filePath.replace(/.*\/([^/]+)$/, '$1');
      if (!cfg.excludeFiles.includes(fileName)) {
        result.push(filePath);
      }
    }
  });
  return result;
}

/**
 * Rewrites all relative links of markdown content to absolute links.
 * Also includes images. See: https://github.com/tcort/markdown-link-extractor/blob/master/index.js
 * @param {string} mdContent - contents of .md file to parse
 * @param {string} filePath - local filesystem path of md file,
 * like '/path/to/lion/packages/my-component/docs/myClass.md'
 * @param {object} cfg - configurantion object
 * @param {string} cfg.githubPath - root github url for the absolute result links
 * @param {string} cfg.monorepoRootPath - local filesystem root path of the monorepo
 * @returns {string} adjusted contents of input md file (mdContent)
 */
function rewriteLinksInMdContent(mdContent, filePath, cfg = rewriteLinksConfig) {
  const rewrite = href => {
    let newHref = href;
    const isRelativeUrlPattern = /^(\.\/|\.\.\/)/; // starts with './' or '../'
    if (href.match(isRelativeUrlPattern)) {
      // For instance 'packages/my-component/docs/myClass.md'
      const relativeFromRootPath = filePath.replace(cfg.monorepoRootPath, '');
      newHref = cfg.githubPath + relativeFromRootPath.slice(1);
    }
    return newHref;
  };

  const mdLink = (href, title, text) => {
    return `[${text}](${rewrite(href)}${title ? ` ${title}` : ''})`;
  };

  const resultLinks = [];
  // /^!?\[(label)\]\(href(?:\s+(title))?\s*\)/
  const linkPattern = /!?\[(.*)\]\(([^|\s]*)(?:\s+(.*))?\s*\)/;
  const matches = mdContent.match(new RegExp(linkPattern, 'g')) || [];

  matches.forEach(link => {
    let newLink = '';
    const parts = link.match(linkPattern);
    if (parts) {
      newLink = mdLink(parts[2], parts[3], parts[1]);
    }
    resultLinks.push(newLink);
  });

  // Now that we have our rewritten links, stitch back together the desired result
  const tokenPattern = /!?\[.*\]\([^|\s]*(?:\s+.*)?\s*\)/;
  const tokens = mdContent.split(new RegExp(tokenPattern, 'g'));
  const resultTokens = [];
  tokens.forEach((token, i) => {
    if (resultLinks[i]) {
      resultTokens.push(token + resultLinks[i]);
    }
  });
  const resultContent = resultTokens.join('');
  return resultContent;
}

/**
 * Main code
 */
function main({ dryRun } = { dryRun: false }) {
  const mdFilePaths = gatherFilesFromDir(process.cwd()); // [path.resolve(__dirname, '../', 'packages/field/docs/FormatMixin.md')];
  mdFilePaths.forEach(filePath => {
    const content = fs.readFileSync(filePath).toString();
    const rewrittenContent = rewriteLinksInMdContent(content, filePath);
    if (dryRun) {
      console.log(`== output for filePath '${filePath}' ===`); // eslint-disable-line no-console
      console.log(rewrittenContent); // eslint-disable-line no-console
    } else {
      fs.writeFileSync(rewrittenContent);
    }
  });
}

module.exports = main;
