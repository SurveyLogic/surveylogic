const glob = require('fast-glob');
const path = require('path');
const fse = require('fs-extra');
const ts = require('typescript');

const TARGET_DIR = path.resolve(__dirname, '../lang.json');

const messages = new Set();

const parseTree = node => {
  // message('some message');
  if (
    node.kind === ts.SyntaxKind.CallExpression &&
    node.expression.escapedText === 'message' &&
    node.arguments[0].kind === ts.SyntaxKind.StringLiteral
  ) {
    messages.add(node.arguments[0].text);
  }

  // <Trans/> will always be self-closing
  if (
    node.kind === ts.SyntaxKind.JsxSelfClosingElement &&
    node.tagName.escapedText === 'Trans'
  ) {
    node.attributes.properties.forEach(prop => {
      // ignore spread attributes
      if (
        prop.kind === ts.SyntaxKind.JsxAttribute &&
        prop.name.escapedText === 'message'
      ) {
        // message="string"
        if (prop.initializer.text) {
          messages.add(prop.initializer.text);

          // message={'string "one"'}
        } else if (
          prop.initializer.expression &&
          prop.initializer.expression.kind === ts.SyntaxKind.StringLiteral
        ) {
          messages.add(prop.initializer.expression.text);
        }
      }
    });
  }

  // trans({message: 'string'})
  if (
    node.kind === ts.SyntaxKind.CallExpression &&
    node.expression.escapedText === 'trans' &&
    node.arguments[0].kind === ts.SyntaxKind.ObjectLiteralExpression
  ) {
    node.arguments[0].properties.forEach(prop => {
      if (prop.name.escapedText === 'message') {
        messages.add(prop.initializer.text);
      }
    });
  }

  node.forEachChild(parseTree);
};

async function run() {
  const files = await glob([
    '../editor/src/**/*.{tsx, ts}',
    '!../editor/src/common/**/*.{tsx, ts}',
  ]);

  files.map(filename => {
    const content = fse.readFileSync(filename).toString();
    const sourceFile = ts.createSourceFile(
      filename,
      content,
      ts.ScriptTarget.Latest
    );
    parseTree(sourceFile);
  });

  const messagesObj = {};

  messages.forEach(message => {
    messagesObj[message] = message;
  });

  const json = JSON.stringify(messagesObj, null, 2);

  fse.writeFile(TARGET_DIR, json);
}

run();
