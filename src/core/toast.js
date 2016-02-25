/**
 * Created by cpc on 1/31/16.
 */

let toastr = null;

export function setContainer(_) {
  toastr = _;
}

export default function toast(type, title, content) {
  toastr.clear();
  toastr[type](content, title);
}
