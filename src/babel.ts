import * as Babel from '@babel/core'
import { MacroError, MacroParams, References } from 'babel-plugin-macros'

/**
 * Validates all references to image-size.macro.
 * @param references - The image-size.macro references.
 */
export function validateReferences(references: References): void {
  const referenceNames = Object.keys(references)

  // Ensure the macro is used only with a default import.
  if (referenceNames.length > 1 || referenceNames[0] !== 'default') {
    throw new MacroError('image-size.macro must be used with a default import.')
  }
}

/**
 * Validates a specific image-size.macro reference.
 * @param reference - The image-size.macro reference.
 * @param state - The Babel tree state.
 */
export function validateReference(reference: Babel.NodePath, state: State): void {
  // Ensure the macro is used as a function call.
  if (!reference.parentPath.isCallExpression()) {
    throwCodeFrameError(reference, 'image-size.macro must be used as a function call.')
  }

  // Ensure the filename of the processed file is defined.
  if (!getProcessedFilename(state)) {
    throwCodeFrameError(reference, 'image-size.macro could not find the filename of the processed file.')
  }
}

/**
 * Returns a validated (index & total number) argument node.
 * @param  nodePath - The node path.
 * @param  index - The argument index.
 * @param  maxArguments - The maximum number of arguments.
 * @return The argument node.
 */
export function getArgumentNode(nodePath: Babel.NodePath, index: number, maxArguments = 1): Babel.NodePath {
  const { parentPath } = nodePath
  const argOrArgs = parentPath.get('arguments')
  const args = Array.isArray(argOrArgs) ? argOrArgs : [argOrArgs]

  if (args.length > maxArguments) {
    throwCodeFrameError(nodePath, 'Too many arguments provided to image-size.macro.')
  }

  const node = args[index]

  if (!node) {
    throwCodeFrameError(nodePath, 'No argument provided to image-size.macro.')
  }

  return node
}

/**
 * Returns the evaluated and validated value of a node.
 * @param  nodePath - The node.
 * @param  predicate - A predicate to validate the value.
 * @return The evaluated value.
 */
export function getNodeValue<T>(nodePath: Babel.NodePath, predicate: (value: unknown) => value is T): T {
  let value: unknown

  try {
    value = nodePath.evaluate().value
  } catch {
    throwCodeFrameError(nodePath, 'Unable to evaluate the value of an argument of image-size.macro.')
  }

  if (!predicate(value)) {
    throwCodeFrameError(nodePath, 'Invalid argument type passed to image-size.macro.')
  }

  return value
}

/**
 * Replaces a node with an expression.
 * @param babel - The babel instance.
 * @param nodePath - The node to replace.
 * @param expression - The expression to replace with.
 */
export function replaceNodeWithExpression(
  babel: typeof Babel,
  nodePath: Babel.NodePath,
  expression: Babel.types.Expression
): void {
  nodePath.parentPath.replaceWith(expression)
}

/**
 * Transform an object to an expression assuming all values are of the same type.
 * @param babel - The babel instance.
 * @param obj - The object to transform.
 * @param transformer - The value transform to apply to all values.
 */
export function objectToExpression(
  babel: typeof Babel,
  obj: Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transformer: (value: any) => Babel.types.Expression
): Babel.types.ObjectExpression {
  const { types } = babel

  return babel.types.objectExpression(
    Object.entries(obj).map(([key, value]) => {
      return types.objectProperty(types.stringLiteral(key), transformer(value))
    })
  )
}

/**
 * Returns the filename being processed.
 * @param  state - The babel state.
 * @return The current filename.
 */
export function getProcessedFilename(state: State): string {
  return state.file.opts.filename
}

/**
 * Pretty-prints an error with a code frame.
 * @param nodePath - The error associated node.
 * @param message -  The error message.
 */
export function throwCodeFrameError(nodePath: Babel.NodePath, message: string): never {
  throw nodePath.buildCodeFrameError(`\n\n${message}\n\n`)
}

/**
 * The Babel state.
 */
export type State = MacroParams['state']
