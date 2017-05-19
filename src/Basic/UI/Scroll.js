import element from 'Element';

export default function scroll(direction){     // "vertical" or "horizontal"
    var scroll = element("div.scroll#scroll");
    scroll.setAttribute("direction",(direction == "horizontal")?direction:"vertical");
    scroll.setAttribute("active",false);
    scroll.isonscroll = false;
    return scroll;
}
