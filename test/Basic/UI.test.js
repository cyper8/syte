/* global describe, it, spyOn, spyOnProperty, expect,
beforeAll, beforeEach, afterAll, afterEach, Element */

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
  describe("Swithable factory",function(){
    var e = UI.Switchable(UI.element("div.test#element"));
    beforeEach(function(){
      spyOn(e,'switch');
      this.eventCallee = function(evt){return true};
      spyOn(this,'eventCallee');
      e.addEventListener('select',this.eventCallee);
    });
    it("adds Attribute, CustomEvent and switch method to an element",
      function(){
        expect(e.hasAttribute("disabled")).toBeTruthy();
        expect(e.getAttribute("disabled")).toBe("false");
        expect(e.hasAttribute("switchable")).toBeTruthy();
        expect(e.getAttribute("switchable")).toBe("true");
        expect(e.classList.contains("selected")).toBeFalsy();
        e.click();
        expect(e.classList.contains("selected")).toBeTruthy();
        expect(e.switch).toHaveBeenCalledWith(true);
        expect(this.eventCallee).toHaveBeenCalled();
        e.click();
        expect(e.classList.contains("selected")).toBeFalsy();
        expect(e.switch).toHaveBeenCalledWith(false);
        expect(e.switch).toHaveBeenCalledTimes(2);
        expect(this.eventCallee).toHaveBeenCalledTimes(2);
      });
    
    afterEach(function(){
      e.removeEventListener('select',this.eventCallee);
      this.eventCallee = null;
    });
  });
  describe("selector factory",function() {
    var e = UI.selector(".test#element"),o,t;
    e.append(o=UI.element("div.option#one"));
    e.append(t=UI.element("div.option#two"));
    t.sticky = true;
    document.body.appendChild(e);
    it("should create selector",function(){
      expect(e.classList.contains("selector"));
    });
    it("that should have items collection and \"selected\" property",function(){
      expect(e.items).toBeDefined();
      expect(e.items.length).toBe(2);
      expect(e.items[0].getAttribute("switchable")).toBe("true");
      expect(e.selected).toBeDefined();
    });
    it("should allow to select and unselect items",function(){
      o.click();
      expect(e.selected).toBe(o);
      o.click();
      expect(e.selected).toBe(null);
    });
    it("should allow to only select sticky items",function(){
      t.click();
      expect(e.selected).toBe(t);
      t.click();
      expect(e.selected).toBe(t);
    });
    it("should allow to select multiple items if multiple=true",function(){
      e.multiple = true;
      o.click();
      expect(e.selected).toContain(t);
      expect(e.selected).toContain(o);
    });
  });
  describe("Pushable factory (with DualState it depends on)",function(){
    var e;
    beforeEach(function(){
      e=UI.Pushable(UI.element("div.test#element"));
      spyOn(e,'action');
    });
    it("should create pushable element",function(){
      expect(e.pushable).toBe(true);
    });
    it("should add action method to it",function(){
      e.click();
      expect(e.action).toHaveBeenCalled();
    });
    it("should implement enable|disable functionality",function(){
      e.disable();
      e.click();
      expect(e.action).not.toHaveBeenCalled();
      e.enable();
      e.click();
      expect(e.action).toHaveBeenCalled();
    });
    afterEach(function(){
      e=null;
    });
  });
});
