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
        var e,e2,trigger=false;
        beforeAll(function(){
          e = UI.section(".testing#element");
          e2 = UI.element("div.another#test");
          e.addEventListener("extend",function (event){
            console.log(event.detail);
            trigger = !trigger;
          });
          spyOn(e,'insertBefore').and.callThrough();
          e.insert(e2);
        });
        it("should be of correct type", function(){
            expect(e.tagName).toBe("DIV");
        });
        it("should implement Extendabe", function(){
            expect(e.extendable).toBeTruthy();
            expect(e.insert).toBeDefined();
            expect(e.children[0]).toBe(e2);
            expect(e.insertBefore).toHaveBeenCalled();
            expect(trigger).toBeTruthy();
        },1000);
    });
    describe("selector factory",function(){
      var e = UI.selector(".test#element");
    })
});
