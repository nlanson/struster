import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, Form } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {MatSnackBar} from '@angular/material/snack-bar';
import { LoginService } from '../login-service.service';
import { Router } from '@angular/router';

import {
  Reg,
  file,
  api_keys,
  remoteUploadRes,
  renameRes,
  deleteRes
 }  from '../interfaces/interfaces';


@Injectable()
@Component({
  selector: 'app-root',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title = 'strustApp';

  registery: Reg;
  search: FormGroup;
  uploadForm: FormGroup;
  listArray: Array<file>;

  api_key: api_keys;
  base: string;
  vidurl: SafeResourceUrl;
  searchTerm: String;
  api_url: string;
  file: file;
  fileNotFound: file = {
    name: "file_not_found",
    size: 0,
    link: "not applicable",
    created_at: "never",
    downloads: 0,
    linkid: "not applicable",
    convert: "none"
  };

  NotFoundToggle: boolean;
  NotFoundDisplay: string;
  showSearch: boolean;
  showBtn: boolean;
  showVid: boolean;
  showUpload: boolean;
  showUploadStatus: boolean;
  showList: boolean;

  uploadRes: remoteUploadRes;
  uploadName: String;
  uploadLink: string;
  uploadAPI: string;
  renameAPI: string;
  renameRes: renameRes;
  uploadStatusMsg: string;
  uploadSuccess: boolean;
  deleteRes: deleteRes;

  dataSource: Array<any>;
  displayedColumns: string[] = ['Name', 'Size', 'Direct Link', 'Stream', 'Delete']; //List Table Colunms

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private _snackBar: MatSnackBar,
    private ls: LoginService,
    private route: Router,

    ) { }

  ngOnInit():void {
    this.showSearch = true;
    this.showVid = false;
    this.showBtn = false;
    this.NotFoundToggle = false;
    this.showUpload = false;

    this.search = this.fb.group(
      {
        searchTerm: [null]
      }
    );
    this.uploadForm = this.fb.group(
      {
        uploadURL: [null],
        uploadName: [null]
      }
    );

    if(this.ls.loginStatus == false){
      this.route.navigate(['login']);

    } else{
      this.setAPI();
      this.update();
    }

  }//end Init



  setAPI(){
    this.base = "https://api.streamtape.com/file/listfolder?login="

    this.api_key = {
      login: "09c8392061b548eebd4e", //change api login here
      key: "Z1doL1Qjm6Fq9Yd", //change api key here
      folder_id: "DjOleF2OpRk" //change folder id here
    };

    this.api_url = this.base + this.api_key.login + "&key=" + this.api_key.key + "&folder=" + this.api_key.folder_id;
  }//end API link set

async update(){
  console.log("Updating Registry...");
  this.registery = await this.http.get<Reg>(this.api_url).toPromise();

    if(this.registery.result != null){
      this.listArray = this.listSort(this.registery.result.files);
    }
    this.dataSource = this.listArray; //List table Datasource

    if(this.registery.status ==  200){
      console.log("Registry updated!");
    } else {
      console.log("Registry update failed.");
      console.log("Error Code: " + this.registery.status);
    }

  }//end update

  listSort(listArray: Array<file>){
      for(let i=0; i<listArray.length; i++){
        if(
          listArray[i].name.charAt(listArray[i].name.length-4) == "." &&
          listArray[i].name.charAt(listArray[i].name.length-3) == "m" &&
          listArray[i].name.charAt(listArray[i].name.length-2) == "p" &&
          listArray[i].name.charAt(listArray[i].name.length-1) == "4"
          ){
            var str_len = listArray[i].name.length -4;
        } else{
          var str_len = listArray[i].name.length;
        }
        listArray[i].name = listArray[i].name.slice(0, str_len);
      }
      listArray.sort(function(a, b) {
        var textA = a.name.toUpperCase();
        var textB = b.name.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      return listArray;
  } //end sort

  submit() {
    this.showVid = false;
    this.showList = false;
    this.showUploadStatus = false;
    this.NotFoundToggle = false;
    this.searchTerm = this.search.value.searchTerm;
    this.searchTerm = this.searchTerm.toLowerCase().trim();
    console.log(this.searchTerm);
    console.log(this.registery);

    let j:number = this.registery.result.files.length;
    for(let i=0; i<j; i++) {
      this.file = this.registery.result.files[i];
      if(this.searchTerm == this.file.name) {
        break;
      }
      this.file = this.fileNotFound;
    }
    //console.log(this.file);
    this.showBtn = true;
  }//end submit

  loadVid() {
    this.showBtn = false;
    this.showUploadStatus = false;

    if(this.file == this.fileNotFound){
      this.NotFoundToggle = true;
      this.NotFoundDisplay = "File not found."
    } else {
      let concat = "https://streamtape.com/e/" + this.file.linkid;
      this.vidurl = this.sanitizer.bypassSecurityTrustResourceUrl(concat);
      this.showVid = true;
    }
  }//end load

  upload() {
    console.log("upload received");
    this.showSearch = false;
    this.showUpload = true;
    this.showVid = false;
    this.showList = false;
  } //end upload

  async remoteUpload() {
    this.uploadName = this.uploadForm.value.uploadName;
    this.uploadLink = this.uploadForm.value.uploadURL;

    this.uploadAPI = "https://api.streamtape.com/remotedl/add?login=" + this.api_key.login + "&key=" + this.api_key.key + "&url=" + this.uploadLink + "&folder=" + this.api_key.folder_id + "&name=" + this.uploadName;
    console.log(this.uploadAPI);
    this.uploadRes = await this.http.get<remoteUploadRes>(this.uploadAPI).toPromise();
    console.log(this.uploadRes.msg);

    if(this.uploadRes.msg == "OK"){
      this.showUploadStatus = true;
      this.uploadSuccess = true;
      this.uploadStatusMsg = "Upload Successful!"
      this.uploadForm.reset();
    } else{
      this.showUploadStatus = true;
      this.uploadSuccess = false;
      this.uploadStatusMsg = this.uploadRes.msg;
    }

  }//end remoteUpload

  list(){
    if(this.registery.status == 200 ) {
      this.showList = true;
      this.showVid = false;
      this.showUploadStatus = false;
    }
  } //end showList

  closeList() {
    this.showList = false;
  }

  viewFromList(linkid: String) {
    this.showList = false;

    let concat = "https://streamtape.com/e/" + linkid;
    this.vidurl = this.sanitizer.bypassSecurityTrustResourceUrl(concat);
    this.showVid = true;
  }//end viewFromList

  navigate(link: string) {
    window.open(link, "_blank");
  }

  async deleteVid(id: string) {
    console.log(id);
    var deleteAPI: string = "https://api.streamtape.com/file/delete?login=" + this.api_key.login + "&key=" + this.api_key.key + "&file=" + id;
    await this.http.get<deleteRes>(deleteAPI).toPromise();

    var message = "Deleted video:" + id + ". Updating registry....";
    var action = "OK";
    this.openSnackBar(message, action);
    this.update();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  searchBtn() {
    this.hideAllForSearch();
  }//end searchBtn

  hideAllForSearch() {
    this.showVid = false;
    this.showUpload = false;
    this.showBtn = false;
    this.showSearch = true;
    this.showList = false;
  }//end hideAllForSearch

  logout() {
    console.log("Logging Out...")
    this.ls.lslogout();
  }


}//end class