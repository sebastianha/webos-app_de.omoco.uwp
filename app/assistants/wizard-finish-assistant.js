/*
Ultimate Wallpaper - The ultimate wallpaper app
Version 1.0.0 (29. Mar 2010)

Copyright (C) 2010 Sebastian Hammerl (E-Mail: uwp@omoco.de)

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 3 of
the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, see <http://www.gnu.org/licenses/>.
*/

function WizardFinishAssistant() {

}

WizardFinishAssistant.prototype.setup = function() {
	this.helper = new Helper();

	this.controller.listen(this.controller.get('next'),Mojo.Event.tap, this.nextButtonPressed.bind(this));
	this.controller.listen(this.controller.get('cancel'),Mojo.Event.tap, this.cancelButtonPressed.bind(this));
	
	this.controller.get('bg4').src = "images/Preview.png";
	this.helper.refreshBGtmp();

	this.spinnerLAttrs = {spinnerSize: 'large'};
	this.spinnerModel = {spinning: true};
	this.controller.setupWidget('waiting_spinner2', this.spinnerLAttrs, this.spinnerModel);
}

WizardFinishAssistant.prototype.nextButtonPressed = function(response) {
	this.controller.get('waiting_spinner').style.display = "block";
	
	this.helper.bg1 = this.helper.bg1tmp;
	this.helper.bg2 = this.helper.bg2tmp;
	this.helper.type = this.helper.typetmp;
	this.helper.design = this.helper.designtmp;
	this.helper.attr = this.helper.attrtmp;
	this.helper.unit = this.helper.unittmp;
	this.helper.bg1tmp = "";
	this.helper.bg2tmp = "";
	this.helper.typetmp = "";
	this.helper.designtmp = "";
	this.helper.attrtmp = "";
	this.helper.unittmp = "";
	this.helper.saveCookie();
	
	/*new Mojo.Service.Request('palm://com.palm.downloadmanager/', {
		method: 'upload',
		parameters: {
			'fileName': this.helper.bg1,
			'url': 'http://uwps.omoco.de/uwps/upload.php?id=' + this.helper.nduid,
			'contentType': 'img',
			'fileLabel': 'image',
			subscribe: true
		},
		onSuccess: this.uploadSuccess.bind(this),
		onFailure: this.uploadFailure.bind(this)
	});*/
	
	var url = "http://uwps.omoco.de/uwps/upload2.php?id=" + this.helper.nduid;
	var request = new Ajax.Request(url, {
		method: 'get',
		onSuccess: this.uploadSuccess.bind(this),
		onFailure: this.uploadFailure.bind(this)
	});
}

WizardFinishAssistant.prototype.cancelButtonPressed = function(response) {
	this.helper.bg1tmp = "";
	this.helper.bg2tmp = "";
	this.helper.typetmp = "";
	this.helper.designtmp = "";
	this.helper.attrtmp = "";
	this.helper.unittmp = "";
	this.helper.saveCookie();
	
	Mojo.Controller.getAppController().getStageController('main').popScenesTo("main");
}

WizardFinishAssistant.prototype.uploadSuccess = function(response) {
	/*if(response.completed == false) {

	}
	if(response.completed == true && response.responseString != null) {
		if (response.responseString == "no id") {
			this.controller.get('waiting_spinner').style.display = "none";
			this.controller.get$('debug').innerHTML = "No id";
		} else if (response.responseString == "no file") {
			this.controller.get('waiting_spinner').style.display = "none";
			this.controller.get('debug').innerHTML = "No file";
		} else if (response.responseString == "wrong format") {
			this.controller.get('waiting_spinner').style.display = "none";
			this.controller.get('debug').innerHTML = "Wrong format";
		} else if (response.responseString == "too big") {
			this.controller.get('waiting_spinner').style.display = "none";
			this.controller.get('debug').innerHTML = "Too big";
		} else if (response.responseString == "could not copy") {
			this.controller.get('waiting_spinner').style.display = "none";
			this.controller.get('debug').innerHTML = "Could not copy";
		} else {
			this.controller.get('debug').innerHTML = "Success";
			
			this.helper.refreshBG(this.bgRefreshed.bind(this));
		}
	}*/
	
	this.controller.get('debug').innerHTML = "Success";
			
	this.helper.refreshBG(this.bgRefreshed.bind(this));
}

WizardFinishAssistant.prototype.bgRefreshed = function(){
	this.helper.onofftoggle = true;
	this.helper.saveCookie();
	this.helper.setWakeUp(this.helper.refreshtime);
	//this.controller.get('waiting_spinner').style.display = "none";
	Mojo.Controller.getAppController().getStageController('main').popScenesTo("main");
}

WizardFinishAssistant.prototype.uploadFailure = function(response) {
	this.controller.get('waiting_spinner').style.display = "none";
	
	//Mojo.Controller.errorDialog("Upload Failure");
}

WizardFinishAssistant.prototype.activate = function(event) {

}

WizardFinishAssistant.prototype.deactivate = function(event) {

}

WizardFinishAssistant.prototype.cleanup = function(event) {

}
