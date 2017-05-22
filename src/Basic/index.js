/*basic.js*/
import { default as UI } from 'UI';
import { addStyles, ModuleStack } from 'Modules';
import CookieStack from 'CookieStack';
import Network from 'Network';
import Reader from 'Reader';
import TimerStack from 'TimerStack';

addStyles('styles/basic.css',function(){console.log("Basic styles applied")});

export default {
    UI,
    Network: new Network(),
    Cookies: new CookieStack(),
    Reader: new Reader(),
    Timers: new TimerStack(),
    Modules: new ModuleStack()
  };