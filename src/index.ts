import { NodePath } from '@babel/core'
import { createMacro, MacroParams } from 'babel-plugin-macros'
import fs from 'fs'
import { imageSize } from 'image-size'
import path from 'path'

import {
  getArgumentNode,
  getNodeValue,
  getProcessedFilename,
  objectToExpression,
  replaceNodeWithExpression,
  State,
  throwCodeFrameError,
  validateReference,
  validateReferences,
} from './babel'
import { isString } from './utils'

/**
 * The image-size macro.
 * @param macroParams - An object containing the macro parameters.
 */
function imageSizeMacro(macroParams: MacroParams) {
  // https://github.com/kentcdodds/babel-plugin-macros/blob/727459f03d3c66a6aae414f1e4ba3fb45c272dcf/other/docs/author.md#function-api
  const { babel, references, state } = macroParams

  validateReferences(references)

  references.default.forEach((reference) => {
    validateReference(reference, state)

    const size = getImageSize(reference, state)

    const sizeExpression = objectToExpression(babel, size, babel.types.numericLiteral)
    replaceNodeWithExpression(babel, reference, sizeExpression)
  })
}

/**
 * Returns the size of an image.
 * @param  nodePath - The image-size.macro node path.
 * @param  state - The Babel tree state.
 * @return The image size.
 */
function getImageSize(nodePath: NodePath, state: State): ImageSize {
  // Grab the current directory.
  const filename = getProcessedFilename(state)
  const cwd = path.dirname(filename)

  // Get the image path argument.
  const imgPathArgNode = getArgumentNode(nodePath, 0)
  const imgPathArg = getNodeValue<string>(imgPathArgNode, isString)

  // Compute the image absolute path.
  const imgPath = path.resolve(cwd, imgPathArg)

  // Check if the file exists.
  const imgExists = fs.existsSync(imgPath)

  if (!imgExists) {
    throwCodeFrameError(nodePath, 'The image path provided to image-size.macro does not exist.')
  }

  // Get the image size.
  const { height, width } = imageSize(imgPath)

  if (!height || !width) {
    throwCodeFrameError(nodePath, 'Unable to compute the height and width of the image provided to image-size.macro.')
  }

  return { height, width }
}

/**
 * The exported image-size macro.
 */
export default createMacro(imageSizeMacro)

/**
 * An image size composed of its width & height.
 */
type ImageSize = { height: number; width: number }
