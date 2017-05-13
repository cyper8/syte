/*basic.js*/

import './ClassExtension';
import 'crossBrowserInnerText.js';
import 'Broadcast.js';
import { default as toA } from 'toArray.js';
import ABtoB64 from 'ArrayBuffertoBase64';
import ajax from 'Ajax';
import Fifo from 'Fifo';
import { default as UI } from 'UI';
import Suspendable from 'Suspendable';
import { default as Modules } from 'Modules';
import CookieStack from 'CookieStack';
import Network from 'Network';
import Reader from 'Reader';
import TimerStack from 'TimerStack';

export default const Base = {
  Network: new Network(),
  Cookies: new CookieStack(),
  Reader: new Reader(),
  Timers: new TimerStack(),
  Modules: new Modules.ModuleStack()
}

export const Basic = {
  toA,
  ABtoB64,
  ajax,
  Fifo,
  UI,
  Suspendable,
  Modules,
  CookieStack,
  Network,
  Reader,
  TimerStack
}
