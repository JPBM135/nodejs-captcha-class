/* eslint-disable no-undef */
'use strict';

const expect = require('chai').expect;
const Captcha = require('../index.js');

describe('#createCaptcha - param value', function() {
	it('param value should work', function() {
		const randomString = Math.random()
			.toString(36)
			.substring(2, 8);
		const result = new Captcha({ value: randomString });
		expect(result).to.have.property('value', randomString);
	});
});
describe('#createCaptcha - param length', function() {
	it('param length should work 1', function() {
		const length = Math.floor(Math.random() * 9 + 1);
		const result = new Captcha({ length: length });
		expect(result.value).to.have.lengthOf(length);
	});
	it('param length should work 2', function() {
		const testParams = [
			{ char: 'a', length: 4 },
			{ char: 'b', length: 8 },
			{ char: '5', length: 3 },
			{ char: 's', length: 43 },
		];
		for (let i = 0; i < testParams.length; i++) {
			const param = testParams[i];
			const { char, length } = param;
			const result = new Captcha({ charset: [char], length: length });
			const expectedValue = Array(length + 1).join(char);
			expect(result).to.have.property('value', expectedValue);
		}
	});
	it('param length < 1', function() {
		expect(() => new Captcha({ length: -1 })).to.throw(Error);
	});
	it('param length !== param.value.length', function() {
		expect(() => new Captcha({ length: 100, value: 'asd' })).to.throw(Error);
	});
});

describe('#createCaptcha - param width', function() {
	it('param width should work', function() {
		const width = 300;
		const result = new Captcha({ width: width });
		expect(result).to.have.property('width', width);
	});
	it('param width should auto calculated', function() {
		const result = new Captcha();
		expect(result).to.have.property('width');
	});
	it('per char width should throw if too small', function() {
		expect(() => new Captcha({ length: 100, width: 200 })).to.throw(Error);
	});
});

describe('#createCaptcha - param height', function() {
	it('param height should work', function() {
		const height = 300;
		const result = new Captcha({ height: height });
		expect(result).to.have.property('height', height);
	});
	it('param height should be by default', function() {
		const result = new Captcha();
		expect(result).to.have.property('height');
	});
	it('param height should throw if too small', function() {
		expect(() => new Captcha({ height: 1 })).to.throw(Error);
	});
});
