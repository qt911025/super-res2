import babel from 'rollup-plugin-babel'

export default {
  input: 'src/super-res.js',
  output: {
    file: 'index.js',
    format: 'cjs'
  },
  plugins: [
    babel({
      babelrc: false,
      presets: [['@babel/preset-env', {
        targets: {
          browsers: ['last 2 versions', 'safari >= 7'],
          node: 4
        },
        modules: false
      }]],
      plugins: ['@babel/plugin-transform-runtime', '@babel/plugin-transform-strict-mode'],
      exclude: 'node_modules/**',
      runtimeHelpers: true
    })
  ]
}
