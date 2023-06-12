// ==UserScript==
// @name          image zoom
// @version       0.1.2
// @namespace     roger21.free.fr
// @description   Basic image zoom functionality as a user-script for your web browser.
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQAAAABbAUdZAAAALElEQVR42mP4DwQMaMQHg8P8EOLz%2F%2F%2FnIcR%2FOPEZpARGUEH2w2EefgiBxS0ARNpzyS9f0t0AAAAASUVORK5CYII%3D
// @include       *
// @updateURL     https://raw.githubusercontent.com/roger21/image-zoom/master/image_zoom.user.js
// @installURL    https://raw.githubusercontent.com/roger21/image-zoom/master/image_zoom.user.js
// @downloadURL   https://raw.githubusercontent.com/roger21/image-zoom/master/image_zoom.user.js
// @supportURL    https://github.com/roger21/image-zoom
// @homepageURL   https://github.com/roger21/image-zoom
// @author        roger21
// @grant         none
// ==/UserScript==

/*

Copyright © 2020-2021, 2023 roger21@free.fr

This program is free software: you can redistribute it and/or modify it under the
terms of the GNU Affero General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License along
with this program. If not, see <https://www.gnu.org/licenses/agpl.txt>.

*/

// historique :
// 0.1.2 (12/06/2023) :
// - added a mutation observer to catch dynamic images
// 0.1.1 (28/01/2021) :
// - updated page height detection for ff 85
// 0.1.0 (18/06/2020) :
// - seems good enougth for publication

var zoom_factor = 1.25;
var zoom_direction = "down";
var zoom_follows_cursor_x = true;
var zoom_follows_cursor_y = true;

let image_observer = new MutationObserver(image_add_events);

image_observer.observe(document, {
  attributes: false,
  childList: true,
  characterData: false,
  subtree: true,
});

function image_add_events() {
  var images = document.querySelectorAll("img:not([image_zoom_events_added])");
  for(let l_image of images) {
    l_image.addEventListener("mousedown", image_zoom_down, true);
    l_image.addEventListener("wheel", image_zoom_wheel, true);
    l_image.setAttribute("image_zoom_events_added", "image_zoom_events_added");
  }
}

image_add_events();

function get_offset(p_element) {
  let _x = 0;
  let _y = 0;
  while(p_element && !isNaN(p_element.offsetLeft) && !isNaN(p_element.offsetTop)) {
    _x += p_element.offsetLeft - p_element.scrollLeft;
    _y += p_element.offsetTop - p_element.scrollTop;
    p_element = p_element.offsetParent;
  }
  return {
    top: _y,
    left: _x
  };
}

function disable_contextmenu(p_event) {
  p_event.preventDefault();
  p_event.stopImmediatePropagation();
  p_event.stopPropagation();
  this.removeEventListener("contextmenu", disable_contextmenu, true);
}

function disable_click(p_event) {
  p_event.preventDefault();
  p_event.stopImmediatePropagation();
  p_event.stopPropagation();
  this.removeEventListener("click", disable_click, true);
}

function disable_mouseup(p_event) {
  p_event.preventDefault();
  p_event.stopImmediatePropagation();
  p_event.stopPropagation();
  this.removeEventListener("mouseup", disable_mouseup, true);
}

function image_zoom_down(p_event) {
  if(p_event.buttons === 3) {
    document.addEventListener("contextmenu", disable_contextmenu, true);
    document.addEventListener("click", disable_click, true);
    document.addEventListener("mouseup", disable_mouseup, true);
    p_event.preventDefault();
    p_event.stopImmediatePropagation();
    p_event.stopPropagation();
    if(this.dataset.imagezoom === "true") {
      this.width = this.dataset.width;
      this.height = this.dataset.height;
      delete this.dataset.imagezoom;
      window.scrollTo(this.dataset.x, this.dataset.y);
      if(this.dataset.margintop === "true") {
        this.style.marginTop = "";
        delete this.dataset.margintop;
      }
    } else {
      let width = this.width;
      let height = this.height;
      this.dataset.width = width;
      this.dataset.height = height;
      this.dataset.x = parseInt(window.scrollX, 10);
      this.dataset.y = parseInt(window.scrollY, 10);
      this.style.maxWidth = "none";
      this.style.maxHeight = "none";
      this.style.width = "";
      this.style.height = "";
      this.dataset.imagezoom = "true";
      let ratio = width / height;
      let window_width = document.documentElement.clientWidth;
      let window_height = window.innerHeight;
      if(document.documentElement.clientHeight && document.documentElement.clientHeight !== 16) {
        window_height = document.documentElement.clientHeight;
      }
      let window_ratio = window_width / window_height;
      if(window_ratio < ratio) {
        this.width = window_width;
        this.height = parseInt(window_width / ratio + .5, 10);
      } else {
        this.width = parseInt(window_height * ratio + .5, 10);
        this.height = window_height;
      }
      this.scrollIntoView();
    }
  }
}

function image_zoom_wheel(p_event) {
  if(p_event.buttons === 2 && p_event.deltaY !== 0) {
    document.addEventListener("contextmenu", disable_contextmenu, true);
    document.addEventListener("click", disable_click, true);
    document.addEventListener("mouseup", disable_mouseup, true);
    p_event.preventDefault();
    p_event.stopImmediatePropagation();
    p_event.stopPropagation();
    let width = this.width;
    let height = this.height;
    let window_width = document.documentElement.clientWidth;
    let window_height = window.innerHeight;
    if(document.documentElement.clientHeight && document.documentElement.clientHeight !== 16) {
      window_height = document.documentElement.clientHeight;
    }
    let window_scroll_x = window.scrollX;
    let window_scroll_y = window.scrollY;
    let offset = get_offset(this);
    let offset_x = p_event.offsetX;
    let offset_y = p_event.offsetY;
    let new_offset_x;
    let new_offset_y;
    if(typeof this.dataset.imagezoom === "undefined") {
      this.dataset.width = width;
      this.dataset.height = height;
      this.dataset.x = parseInt(window.scrollX, 10);
      this.dataset.y = parseInt(window.scrollY, 10);
      if(this.classList.contains("overflowingVertical")) {
        let ratio = width / height;
        this.dataset.width = parseInt(window_height * ratio + .5, 10);
        this.dataset.height = window_height;
        this.dataset.x = 0;
        this.dataset.y = 0;
      }
      this.style.maxWidth = "none";
      this.style.maxHeight = "none";
      this.style.width = "";
      this.style.height = "";
      this.dataset.imagezoom = "true";
    }
    if((zoom_direction === "down" && p_event.deltaY < 0) || (zoom_direction !== "down" && p_event.deltaY > 0)) {
      this.width = parseInt(width / zoom_factor + .5, 10);
      this.height = parseInt(height / zoom_factor + .5, 10);
      new_offset_x = parseInt(offset_x / zoom_factor + .5, 10);
      new_offset_y = parseInt(offset_y / zoom_factor + .5, 10);
    } else {
      this.width = parseInt(width * zoom_factor + .5, 10);
      this.height = parseInt(height * zoom_factor + .5, 10);
      new_offset_x = parseInt(offset_x * zoom_factor + .5, 10);
      new_offset_y = parseInt(offset_y * zoom_factor + .5, 10);
    }
    if(this.offsetTop < 0) {
      this.style.marginTop = "0";
      this.dataset.margintop = "true";
    } else if(this.height < window_height &&
      (this.dataset.margintop === "true" || this.classList.contains("overflowingVertical"))) {
      this.style.marginTop = "";
      this.classList.remove("overflowingVertical");
      delete this.dataset.margintop;
    }
    if(zoom_follows_cursor_x || zoom_follows_cursor_y) {
      let new_offset = get_offset(this);
      let variation_x = new_offset.left + new_offset_x - (offset.left + offset_x);
      variation_x = zoom_follows_cursor_x ? variation_x : 0;
      let variation_y = new_offset.top + new_offset_y - (offset.top + offset_y);
      variation_y = zoom_follows_cursor_y ? variation_y : 0;
      window.scrollTo(window.scrollX + variation_x, window.scrollY + variation_y);
    }
  }
}