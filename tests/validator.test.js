// const { is } = require('core-js/core/object')
const {isInvalidEmail, isEmptyPayload} = require('../validator')

test('valid email', function() {
    const testPayload = {
        name: "test name",
        email: "test@test.com",
        interest: "test"
    }
    const result = isInvalidEmail(testPayload)
    expect(result).toBe(false)
})

test('invalid email', function() {
    const testPayload = {
        name: "test name",
        email: "test.com",
        interest: "test"
    }
    const result = isInvalidEmail(testPayload)
    expect(result).toBe(true)
})

test('empty payload', function() {
    const testPayload = {}
    const result = isEmptyPayload(testPayload)
    expect(result).toBe(true)
})

test('non-empty payload', function() {
    const testPayload = {
        name: "test name",
        email: "test@email",
        interest: "test"
    }
    const result = isEmptyPayload(testPayload)
    expect(result).toBe(false)
})