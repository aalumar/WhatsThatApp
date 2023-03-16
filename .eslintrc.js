module.exports = {

  extends: 'airbnb',
  parser: '@babel/eslint-parser',
  ecmaFeatures: {
    classes: true
  },
  parserOptions: {
    requireConfigFile: false,
    ecmaVersion: 2018,
    babelOptions: {
      // presets: ['@babel/preset-react'],
      parserOpts: {
        plugins: ['jsx']
      }
    }
  },
  rules: {
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
    'linebreak-style': 0,
    'comma-dangle': ['error', 'never'],
    'eol-last': ['error', 'never'],
    strict: 0,
    'react/prefer-stateless-function': [0, { ignorePureComponents: true }],
    'object-curly-newline': ['error', { ObjectPattern: { multiline: true } }],
    'padded-blocks': ['error', 'always', { allowSingleLineBlocks: true }],
    'react/destructuring-assignment': 0,
    'max-len': ['error', { code: 150, ignoreComments: true }],
    'brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
    'prefer-destructuring': 0,
    'react/no-unescaped-entities': 0,
    'global-require': 0,
    'no-throw-literal': 0,
    'react/prop-types': 0,
    'no-use-before-define': 0,
    'arrow-body-style': ['error', 'always'],
    'no-console': 0,
    'prefer-template': 0
  }

};