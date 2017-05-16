import { default as UI } from 'Basic/UI';

describe("Basic/UI provides", function(){
    describe("element factory", function(){
        var e=UI.element("div.test-class.other-class#element");
        it("should create HTML element", function(){
            expect(e instanceof Element).toBeTruthy();
        });
        it("should set element's class", function(){
            expect(e.classList.contains("test-class")).toBeTruthy();
            expect(e.classList.contains("other-class")).toBeTruthy();
        });
        it("should set element's id", function(){
            expect(e.id).toBe("element");
        });
    });
    describe("section factory",function(){
        var e = UI.section(".testing#element");
        e.calledOnExtension = function(){};
        e.addEventListener("extend",e.calledOnExtension);
        beforeAll(function(){
            spyOn(e,'insertBefore');
            spyOn(e,'calledOnExtension');
            e.insert(UI.element("div.another#test"));
        })
        it("should be of correct type", function(){
            expect(e.tagName).toBe("DIV");
        });
        it("should be extendabe", function(){
            expect(e.extendable).toBeTruthy();
            expect(e.insert).toBeDefined();
            expect(e.insertBefore).toHaveBeenCalled();
            expect(e.calledOnExtension).toHaveBeenCalled();
        })
    })
});