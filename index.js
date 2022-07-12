'use strict';

const { createCanvas } = require('canvas');

const PER_CHAR_WIDTH = 40;
const MIN_HEIGHT = 50;
const DEFAULT_HEIGHT = 100;
const DEFAULT_WIDTH = 200;
const DEFAULT_LENGTH = 6;
const DEFAULT_MIN_CIRCLE = 10;
const DEFAULT_MAX_CIRCLE = 25;
const DEFAULT_CHARSET = '1234567890abcdefghijklmnoprstuvyzABCDEFGHIJKLMN@#'.split('');
const COLORS = ['white', 'black', 'random'];

class Captcha {
	/**
	 * @param {import('./typings').captchaOptions} params
	 */
	constructor(params = {}) {
		if (params.charset && typeof params.charset === 'string') {
			/** @type {string[]} */
			this.charset = params.charset.split('');
		}
		else {
			/** @type {string[]} */
			this.charset = params.charset || DEFAULT_CHARSET;
		}

		if (params.value && params.length && (params.length !== params.value.length)) {
			throw new Error('Parameter Length and Parameter Value Length is inconsistent');
		}

		if (params.length && params.length < 1) {
			throw new RangeError('Parameter Length is less then 1');
		}

		/** @type {number} */
		this.length = params.length || DEFAULT_LENGTH;
		/** @type {string} */
		this.value = params.value || this.generateValue();
		if (params.value && !params.length) {
			this.length = params.value.length;
		}

		if (params.width && (params.width < PER_CHAR_WIDTH * this.length)) {
			throw new RangeError('Width per char should be more than ' + PER_CHAR_WIDTH * this.length);
		}
		/** @type {number} */
		this.width = params.width || Math.min(DEFAULT_WIDTH, this.length * PER_CHAR_WIDTH);

		if (params.height && (params.height < MIN_HEIGHT)) {
			throw new RangeError('Min Height is ' + PER_CHAR_WIDTH);
		}
		/** @type {number} */
		this.height = params.height || DEFAULT_HEIGHT;

		/** @type {number} */
		this.numberOfCircles = params.numberOfCircles || DEFAULT_MIN_CIRCLE + Math.floor(Math.random() * (DEFAULT_MAX_CIRCLE - DEFAULT_MIN_CIRCLE));

		if (params.quality && (params.quality < 0.5 || params.quality > 1)) {
			throw new RangeError('Quality should be between 0.5 and 1');
		}
		/** @type {number} */
		this.quality = params.quality || 0.7;

		/** @type {'black' | 'white' | 'random'} */
		this.color = params.color || COLORS[Math.floor(Math.random() * COLORS.length)];

		/** @type {import('canvas').Canvas} */
		this._canvas = createCanvas(this.width, this.height);
		/** @type {import('canvas').CanvasRenderingContext2D} */
		this.ctx = this._canvas.getContext('2d');

		/** @type {string} */
		this._image = this.drawImage();
	}

	get image() {
		return this._image;
	}

	get buffer() {
		return Buffer.from(this._image.split(',')[1], 'base64');
	}

	generateValue() {
		const len = this.charset.length;
		let value = '';
		for (let i = 0; i < this.length; i++) {
			value += this.charset[Math.floor(Math.random() * len)];
		}
		return value;
	}

	drawImage() {
		this.fillBackground();
		this.addCircles();
		this.printText();

		return this._canvas.toDataURL('image/jpeg', this.quality);
	}

	fillBackground() {
		if (this.color === 'black') {
			this.ctx.fillStyle = '#353535';
			this.ctx.fillRect(0, 0, this.width, this.height);
		}
		else if (this.color === 'white') {
			this.ctx.fillStyle = '#FFFFFF';
			this.ctx.fillRect(0, 0, this.width, this.height);
		}
		else {

			const gradient = this.ctx.createLinearGradient(0, 0, this.width, this.height);

			for (let i = 0; i < 10; i++) {
				gradient.addColorStop(Math.random() * 0.1 + i * 0.1, this.randomLightColor(5));
			}
			this.ctx.fillStyle = gradient;
			this.ctx.fillRect(0, 0, this.width, this.height);
		}
	}

	printText() {
		const width = (this.width - 10) / this.length;
		const height = this.height;
		const value = this.value;

		const allCords = [];

		for (let i = 0; i < this.length; i++) {
			// Font Size
			const fontSize = Math.random() * 40 + 24 /* + (this.width / this.length) * 0.3 */;
			this.ctx.font = fontSize + 'px serif';

			// Font Color
			this.ctx.fillStyle = this.color === 'black' ? this.randomLightColor(10) : this.randomDarkColor(10);

			// Font Location
			const topMargin = ((height - fontSize) * Math.random()) / 2.5;

			const cordinates = {
				x: 5 + width * i,
				y: height / 3 + fontSize - 10 + topMargin,
				fontSize: {
					width: this.ctx.measureText(value[i]).width,
					height: fontSize,
				},
			};

			allCords.push(cordinates);

			this.ctx.fillText(
				value.charAt(i),
				cordinates.x,
				cordinates.y,
			);
		}

		this.ctx.strokeStyle = this.randomDarkColor(10);
		this.ctx.lineWidth = 4;
		this.ctx.lineJoin = 'round';
		this.ctx.lineCap = 'round';

		let last = [allCords[0].x, allCords[0].y, allCords[0].fontSize];

		for (let i = 0; i < allCords.length; i++) {
			const x = allCords[i + 1]?.x || allCords[i].x;
			const y = allCords[i + 1]?.y || allCords[i].y;
			const fontSize = allCords[i + 1]?.fontSize || allCords[i].fontSize;

			const lastFontSize = last[2];

			this.ctx.beginPath();
			this.ctx.moveTo(last[0] + lastFontSize.width / 2, last[1] - lastFontSize.height / 4);
			this.ctx.lineTo(x + fontSize.width / 2, y - fontSize.height / 4);
			this.ctx.stroke();

			last = [x, y, fontSize];
		}
	}

	addCircles() {
		let i = 0;

		const nOfCircles = this.numberOfCircles / 2;

		// Dark Circles
		while (i < nOfCircles) {
			i++;

			if (this.color === 'black') continue;

			this.ctx.beginPath();

			// Radius
			const radius = 10 * Math.random() + 5;

			// Center
			const centerX = this.width * Math.random();
			const centerY = this.height * Math.random();

			// Color
			this.ctx.strokeStyle = this.randomDarkColor(5);

			// Width
			this.ctx.lineWidth = 0.5 * Math.random();
			this.ctx.arc(
				centerX,
				centerY,
				radius,
				0,
				Math.PI * (1.5 + Math.random() * 0.5),
				false,
			);
			this.ctx.stroke();
		}

		i = 0;

		// Light Circles
		while (i < nOfCircles) {
			i++;

			if (this.color === 'white') continue;

			// Color
			this.ctx.strokeStyle = this.randomLightColor(5);

			// Width
			this.ctx.lineWidth = 4 * Math.random();

			// Radius
			const radius = 10 * Math.random() + 5;

			// Center
			const centerX = this.width * Math.random();
			const centerY = this.height * Math.random();
			this.ctx.beginPath();
			this.ctx.arc(centerX, centerY, radius, 0, Math.PI * (1 + Math.random()), false);
			this.ctx.stroke();
		}
	}

	randomLightHex(amount = 4) {
		return (16 - Math.floor(Math.random() * amount + 1)).toString(16);
	}

	randomDarkHex(amount = 4) {
		return Math.floor(Math.random() * amount + 1).toString(16);
	}

	randomLightColor(amount) {
		return (
			'#' +
			this.randomLightHex(amount) +
			this.randomLightHex(amount) +
			this.randomLightHex(amount)
		);
	}

	randomDarkColor(amount) {
		return (
			'#' + this.randomDarkHex(amount) + this.randomDarkHex(amount) + this.randomDarkHex(amount)
		);
	}
}

module.exports = Captcha;
// exports = Captcha;