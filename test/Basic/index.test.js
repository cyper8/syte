/* global describe, it, expect, app */

import { default as App } from 'Basic';
window.App = App;
describe("Basic library creates a Global Object that", function(){
    it("has Network subsystem", function(){
        expect(App.Network).toBeDefined();
    });
    it("has Cookies subsystem", function(){
        expect(App.Cookies).toBeDefined();
    });
    it("has Reader subsystem", function(){
        expect(App.Reader).toBeDefined();
    });
    it("has Timers subsystem", function(){
        expect(App.Timers).toBeDefined();
    });
    it("has Modules subsystem", function(){
        expect(App.Modules).toBeDefined();
    });
    it("has UI section defined", function(){
        expect(App.UI).toBeDefined();
    });
});