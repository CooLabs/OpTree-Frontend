// .eslintrc.js

module.exports = {
  root: true,
  env: {
    browser: true,
    jest: true,
    es6: true,
    es2020: true, // <- activate “es2020” globals
    node: true,
    mocha: true,
  },
  extends: ['prettier'],
  plugins: ['prettier', 'import', 'react', 'react-hooks'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    parser: 'babel-eslint',
  },
  parser: '@typescript-eslint/parser',
  rules: {
    // 自定义 prettier 规则 (实际上，可配置项非常有限)
    // 'prettier/prettier': [
    //   'warn',
    //   {
    //     singleQuote: true,
    //     trailingComma: 'all',
    //   },
    // ],
    'prettier/prettier': 'off',
    camelcase: 'off', // 强制驼峰法命名
    'no-new': 'off', // 禁止在使用new构造一个实例后不赋值
    'space-before-function-paren': 'off', // 函数定义时括号前面不要有空格
    'no-plusplus': 'off', // 禁止使用 ++， ——
    'max-len': 'off', // 字符串最大长度
    'func-names': 'off', // 函数表达式必须有名字
    'no-param-reassign': 'off', // 不准给函数入参赋值
  },
  settings: {
    indent: ["error", 2],
    "import/extensions": [".js", ".jsx", ".ts", ".tsx"],
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
};
