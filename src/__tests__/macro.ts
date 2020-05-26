import plugin from 'babel-plugin-macros'
import pluginTester from 'babel-plugin-tester'

/**
 * The macro path & import.
 */
const macroPath = "'../../lib/index.macro'"
const macroImport = `import imageSize from ${macroPath};`
const fixtureDirectoryPath = './__fixtures__'
const imageFixturePath = `'${fixtureDirectoryPath}/image.png'`

describe('validateReferences', () => {
  const error = 'image-size.macro must be used with a default import.'

  pluginTester({
    plugin,
    babelOptions: { filename: __filename },
    tests: {
      'should throw if a default import is not used': {
        code: `
          import { thing } from ${macroPath};
          const size = thing();
        `,
        error,
      },
      'should throw if a named import is used with a default import': {
        code: `
          import imageSize, { thing } from ${macroPath};
          const size = imageSize();
        `,
        error,
      },
      'should throw if only a named import is used': {
        code: `
          import { thing } from ${macroPath};
          const size = thing();
        `,
        error,
      },
    },
  })
})

describe('validateReference', () => {
  pluginTester({
    plugin,
    babelOptions: { filename: __filename },
    tests: {
      'should throw if the macro is not used as a function call': {
        code: `
          ${macroImport}
          const size = imageSize;
        `,
        error: 'image-size.macro must be used as a function call.',
      },
    },
  })
})

describe('getImageSize', () => {
  pluginTester({
    plugin,
    babelOptions: { filename: __filename },
    snapshot: true,
    tests: {
      'should throw if the image does not exist': {
        code: `
          ${macroImport}
          const size = imageSize('${fixtureDirectoryPath}/random.png');
        `,
        error: 'The image path provided to image-size.macro does not exist.',
        snapshot: false,
      },
      'should throw if the file is not a valid image': {
        code: `
          ${macroImport}
          const size = imageSize('${fixtureDirectoryPath}/invalid.png');
        `,
        error: /image-size\.macro could not measure image size: /,
        snapshot: false,
      },
      'should return the image size for a valid file': {
        code: `
          ${macroImport}
          const size = imageSize(${imageFixturePath});
        `,
      },
    },
  })
})
