/*basic.js*/
import { UI } from 'UI';
import { addStyle, ModuleStack } from 'Modules';
import CookieStack from 'CookieStack';
import Network from 'Network';
import Reader from 'Reader';
import TimerStack from 'TimerStack';

addStyle('/styles/basic.css',function(){console.log("Basic styles applied")});

export default function(){
  return {
    UI,
    Network: new Network(),
    Cookies: new CookieStack(),
    Reader: new Reader(),
    Timers: new TimerStack(),
    Modules: new ModuleStack()
  };
}