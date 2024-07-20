/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = (opts = {}) => {
  return {
    postcssPlugin: 'namespace-pixie-styles',
    Rule(rule, postcss) {
      if (!rule.selectors) {
        return rule;
      }

      rule.selectors = rule.selectors.map(function (selector) {
        if (selector.trim().length === 0) {
          return selector;
        }
        if (['html', 'body'].includes(selector)) {
          return null;
        }
        return `.pi ${selector}`;
      });
      return rule;
    },
  };
};

module.exports.postcss = true;
