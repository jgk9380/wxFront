import { Component } from '@angular/core';
import {unescape} from "querystring";
import {WxCodeService} from "./wx.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
constructor(private wxCodeService: WxCodeService){

}

  ngOnInit() {
    let code=this.getRequestParams()["code"];
    //let code = this.getQueryString("code");
    alert("code=" + code);
    alert("location=" + window.location);
    this.wxCodeService.code=code;
    }

  getRequestParams() {
    var url = "" + window.location; //获取url中"?"符后的字串
    var theRequest = new Object();
    console.log("url=" + url);
    console.log("url.indexOf(?)=" + url.indexOf("?"));
    if (url.indexOf("?") != -1) {
      var str = url.substr(url.indexOf("?") + 1);
      if(str.indexOf("#")!=-1){
        //截掉后部
        str=str.substring(0,str.indexOf("#"))
      }
      console.log("str=   " + str);
      var strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
        //theRequest[strs[i].split("=")[0]] = window.unescape(strs[i].split("=")[1]);
        theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
      }
    }
    console.log("theRequest=" + JSON.stringify(theRequest))
    return theRequest;
  }
}
