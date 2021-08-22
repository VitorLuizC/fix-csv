const index_esm = require("./index.esm")
// @ponicode
describe("index_esm.isNumberParseable", () => {
    test("0", () => {
        let callFunction = () => {
            index_esm.isNumberParseable("Elio")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            index_esm.isNumberParseable("Dillenberg")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            index_esm.isNumberParseable("elio@example.com")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            index_esm.isNumberParseable(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})
