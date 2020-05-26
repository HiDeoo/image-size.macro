import type { ImageSize } from './src/index.macro'

/**
 * Loads an image from the provided path and returns its size (width & height).
 *
 * If the file can't be resolved or is invalid, the build will fail.
 *
 * @example
 *
 * ```js
 * import imageSize from 'image-size.macro';
 *
 * const myImageSize = imageSize('./my-image.png');
 * ```
 *
 * ↓ ↓ ↓ ↓ ↓ ↓
 *
 * ```js
 * const myImageSize = { height: 20, width: 10 };
 * ```
 */
export default function imageSize(imgPath: string): ImageSize
