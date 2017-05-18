/* global describe, it, spyOn, spyOnProperty, expect,
beforeAll, beforeEach, afterAll, afterEach, Element */

import 'Basic/ClassExtension';
// import 'crossBrowserInnerText.js';
// import { default as toA } from 'toArray.js';
// import Fifo from 'Fifo';
// import ABtoB64 from 'ArrayBuffertoBase64';

describe("Global Function expanded with \"extends\" method.\
If classes are defined with constructors \
they can be chained by inheritance.",function(){
  var c,s;
  function SuperClass(x){ // entity to be extended
    this.memory = x || 0;
    this.growby = function(y){
      return this.memory += y;
    };
  }
  function Class(x){ // entity to extend with
    this.base = x;
    this.growbybase = function(y){
      return this.memory += (this.base*y);
    };
  }
  Class.extends(SuperClass);
  beforeEach(function(){
    c=new Class(1);
    s=new SuperClass(2);
  });
  it("Class should support methods and properties of SuperClass", function(){
    expect(c.memory).toBeDefined();
    expect(c.memory).toEqual(0);
    expect(c.growby).toBeDefined();
    c.growby(1);
    expect(c.memory).toEqual(1);
  });
  it("BaseClass should not support methods and props of Super",function(){
    expect(s.base).not.toBeDefined();
    expect(s.growbybase).not.toBeDefined();
    expect(c.base).toBeDefined();
    expect(c.base).toEqual(1);
    expect(c.growbybase).toBeDefined();
    c.growbybase(2);
    expect(c.memory).toEqual(2);
  });
  it("An instance of Super class should be also an instance of a Base", function(){
    expect(s instanceof SuperClass).toBeTruthy();
    expect(c instanceof Class).toBeTruthy();
    expect(s instanceof Class).toBeFalsy();
    expect(c instanceof SuperClass).toBeTruthy();
  });
});