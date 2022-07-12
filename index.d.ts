import { captchaOptions } from './typings';

declare class Captcha {

	public charset: string[];
	public length: number;
	public value: string;
	public width: number;
	public height: number;
	public numberOfCircles: number;
	public quality: number;

	public constructor(options?: captchaOptions);

	public get image(): string;
	public get buffer(): Buffer;
}

export default Captcha;