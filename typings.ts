
export interface captchaValue {
	/**
	 * The text value encoded on the captcha
	 */
	value: string;
	/**
	 * The width of the captcha
	 */
	width: number;
	/**
	 * The height of the captcha
	 */
	height: number;
	/**
	 * The image data of the captcha
	 *
	 * **Base64 string** (contains `data:image/png;base64`)
	 */
	image: string;
}

export interface captchaOptions {
	/**
	 * The character set to use for the captcha.
	 * @default {'1234567890abcdefghijklmnoprstuvyz'.split('')}
	 */
	charset?: string|string[];
	/**
	 * The length of the captcha.
	 * @default 6
	 * @throws {Error} If the length is less than 1
	 */
	length?: number;
	/**
	 * The value of the text to display on the captcha.
	 * @default 'Randomly generated using the charset'
	 * @throws {Error} If the length of the value is different than the length
	 */
	value?: string;
	/**
	 * The width of the captcha.
	 * @default 200
	 * @throws {Error} If the width is less than 40
	 */
	width?: number;
	/**
	 * The height of the captcha.
	 * @default 100
	 * @throws {Error} If the height is less than 50
	 */
	height?: number;
	/**
	 * Number of noise circles to add to the captcha.
	 * @default {10-25} Randomly generated
	 */
	numberOfCircles?: number;
	/**
	 * Quality of the image.
	 * 
	 * `0.5` to `1.0`
	 */
	quality?: number;
	/**
	 * The color of the captcha.
	 */
	color?: 'black' | 'white' | 'random';
}