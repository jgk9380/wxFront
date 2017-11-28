import {Component, OnInit} from "@angular/core";
import {unescape} from "querystring";
import {HttpClient} from "@angular/common/http";
import "rxjs/add/observable/forkJoin";
import {ToasterService, ToasterConfig} from "angular2-toaster";
@Component({
  selector: 'app-bind',
  templateUrl: './bind.component.html',
  styleUrls: ['./bind.component.css']
})

export class BindComponent implements OnInit {
  baseUrl = "http://127.0.0.1";
  // url = "http://www.cu0515.com/wx/codeToOpenId/";
  wxUser: any;
  authCode: string;
  newTele: string;
  getAuthCodeButtonTitle: string = "获取验证码";
  getAuthCodeButtonDisable = false;

  toasterConfig: ToasterConfig =
    new ToasterConfig({
      showCloseButton: true,
      tapToDismiss: true,
      timeout: 2000,
      positionClass: "toast-center"
    });

  constructor(private  httpClient: HttpClient, private  toasterService: ToasterService) {

  }

  ngOnInit() {
    let code = this.getUrlParam("code");
    if (!code) {
      code = "authdeny";
    }
    var x = this.httpClient.get(this.baseUrl + "/wx/codeToOpenId/" + code).subscribe(data => {
        var tempResult: any = data;
        this.wxUser = tempResult.data;
        this.newTele = this.wxUser.tele;
        console.log("wxUser=" + JSON.stringify(this.wxUser));
      }
    );
  }


  getAuthCode() {
    this.httpClient.get(this.baseUrl + "/NoAuthService/smsAuth/" + this.newTele).subscribe(data => {
      var temp: any = data;
      console.log(data);
      if (temp.errorCode == 0) {
        console.log("验证码发送成功，请查收！");
        this.toasterService.pop({
          type: 'success',
          title: '验证码发送成功，请查收！',
          showCloseButton:true,
        });
        var restTime = 60;
        this.getAuthCodeButtonDisable = true;
        var interval = setInterval(() => {
          restTime = restTime - 1;
          this.getAuthCodeButtonTitle = "" + restTime + "s";
          if (restTime <= 0) {
            clearInterval(interval);
            this.getAuthCodeButtonTitle = "获取验证码";
            this.getAuthCodeButtonDisable = false;
          }
          //console.log("title="+this.getAuthCodeButtonTitle+"restTime="+restTime);
        }, 1000);
      }
    })
  }

  bindTele() {
    ///NoAuthService/bindTele/{wxUserId}/{tele}/{code}
    var url = "/NoAuthService/bindTele/" + this.wxUser.id + "/" + this.newTele + "/" + this.authCode;
    console.log("url=" + this.baseUrl + url);
    this.httpClient.post(this.baseUrl + url).subscribe(data => {
      console.log("bind result=" + JSON.stringify(data));
      var result: any = data;
      if (result.code == 0) {
        console.log("号码绑定成功！");

        this.wxUser.tele = this.newTele;
        this.toasterService.pop({
          type: 'success',
          title: '号码绑定成功',
          showCloseButton:true,
        });
      }
    });
  }

  submitUserInfo() {
    var url = "/NoAuthService/userAddressLName/" + this.wxUser.id + "/" + this.wxUser.longName + "/" + this.wxUser.mailAddr;
    this.httpClient.post(this.baseUrl + url).subscribe(data => {
      console.log("bind result=" + JSON.stringify(data));
      var result: any = data;
      if (result.code == 0) {
        console.log("资料修改成功！");
        this.toasterService.pop({
          type: 'success',
          title: '资料修改成功',
          showCloseButton:true,
        });
        //this.wxUser.tele=this.newTele;
      }
    });
  }


  isTeleDisable(): boolean {
    var isChinaUnion = /^1(3[0-2]|5[56]|8[56]|4[5]|7[6])\d{8}$/;
    var bool = isChinaUnion.test(this.wxUser.tele);
    //console.log("bool=" + bool);
    return bool;
  }


  teleIsUnicom() {
    var isChinaUnion = /^1(3[0-2]|5[56]|8[56]|4[5]|7[6])\d{8}$/;
    var bool = isChinaUnion.test(this.wxUser.tele);
    //console.log("bool=" + bool);
    return bool;
  }

  getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  }

}
