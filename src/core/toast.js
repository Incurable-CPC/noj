/**
 * Created by cpc on 1/31/16.
 */

let toastr = null;
let msg = null;

export function setContainer(_) {
  toastr = _;
  if (msg) {
    const { type, title, content } = msg;
    toast(type, title, content);
  }
}

export default function toast(type, title, content) {
  if (toastr) {
    toastr.clear();
    toastr[type](content, title);
  } else {
    msg = { type, title, content };
  }
}
