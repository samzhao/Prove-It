'use strict';

var prove = require('../lib/index.js');
var should = require('should');

describe('Object Validator', function () {
    it('should validate a simple object', function () {
        var doc = {
            name: {
                first: 'hello',
                last: 'world'
            },
            phone: '555555'
        };


        var test = {
            name: prove({
                first: prove('First Name').isString().isLength(6),
                last: prove('Last Name').isString().isLength(6)
            }),
            phone: prove().isPhoneNumber()
        };

        prove(test)(doc).errors.should.eql({
            'name.first': {
                message: [ 'First Name should be more than 6 characters long' ],
                value: 'hello'
            },
            'name.last': {
                message: [ 'Last Name should be more than 6 characters long' ],
                value: 'world'
            }
        });
    });

    it('should work on a deep object', function () {
        var doc = {
            name: {
                first: {
                    value: 'hello',
                    caps: 'HELLO'
                },
                last: 'world'
            },
            phone: '555555'
        };

        var test = {
            name: prove({
                first: prove({
                    value: prove('First Name').isString().isLength(6),
                    caps: prove('First Name Caps').isString().isLength(6)
                }),
                last: prove('Last Name').isString().isLength(6)
            }),
            phone: prove().isPhoneNumber()
        };

        prove(test)(doc).errors.should.eql({
            'name.first.value': {
                message: [ 'First Name should be more than 6 characters long' ],
                value: 'hello'
            },
            'name.first.caps': {
                message: [ 'First Name Caps should be more than 6 characters long' ],
                value: 'HELLO'
            },
            'name.last': {
                message: [ 'Last Name should be more than 6 characters long' ],
                value: 'world'
            }
        });
    });

    it('should validate a extra fields on an object', function () {
        var doc = {
            name: {
                first: 'hello',
                last: 'world'
            },
            phone: '555555',
            invalidField: 'hi'
        };

        var test = {
            name: prove({
                first: prove('First Name').isString().isLength(4),
                last: prove('Last Name').isString().isLength(4)
            }),
            phone: prove().isPhoneNumber()
        };

        prove(test)(doc).errors.should.eql({
            invalidField: {
                message: [ 'invalidField is not an allowed field' ],
                value: 'hi'
            }
        });
    });

    it('should validate a required fields on an object', function () {
        var doc = {

        };

        var test = {
            name: prove({
                first: prove('First Name').isString().isLength(4),
                last: prove('Last Name').isRequired().isString().isLength(4)
            }),
            phone: prove('Phone Number').isRequired().isPhoneNumber()
        };

        prove(test)(doc).errors.should.eql({
            'name.last': {
                message: [ 'Last Name is a required field' ],
                value: undefined
            },
            phone: {
                message: [ 'Phone Number is a required field' ],
                value: undefined
            }
        });
    });
});