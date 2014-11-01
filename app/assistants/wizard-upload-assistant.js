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

function WizardUploadAssistant() {

}

WizardUploadAssistant.prototype.setup = function() {
	this.helper= new Helper();
	
	this.controller.listen(this.controller.get('select'),Mojo.Event.tap, this.selectButtonPressed.bind(this));
	this.controller.listen(this.controller.get('next'),Mojo.Event.tap, this.nextButtonPressed.bind(this));
	
	this.helper.bg1tmp = this.helper.bg1;
	this.helper.saveCookie();
	this.controller.get('bg1').src = this.helper.bg1tmp;
	
	this.spinnerLAttrs = {spinnerSize: 'large'};
	this.spinnerModel = {spinning: true};
	this.controller.setupWidget('waiting_spinner2', this.spinnerLAttrs, this.spinnerModel);
}

WizardUploadAssistant.prototype.selectButtonPressed = function(event) {
	var params = {
		kinds: ['image'],
		onSelect: this.pickImage.bind(this)
	};
	Mojo.FilePicker.pickFile(params, this.controller.stageController);
}

WizardUploadAssistant.prototype.pickImage = function(response) {
	this.helper.bg1tmp = response.fullPath;
	this.helper.saveCookie();
	this.controller.get('bg1').src = this.helper.bg1tmp;
	
	this.controller.get('info').innerHTML = "";
}

WizardUploadAssistant.prototype.nextButtonPressed = function(response) {
	if (this.helper.bg1tmp != "") {
		this.controller.get('waiting_spinner').style.display = "block";
		this.controller.serviceRequest('palm://com.palm.downloadmanager/', {
			method: 'upload',
			parameters: {
				'fileName': this.helper.bg1tmp,
				'url': 'http://uwps.omoco.de/uwps/upload.php?id=' + this.helper.nduid + "_tmp",
				'contentType': 'img',
				'fileLabel': 'image',
				subscribe: true
			},
			onSuccess: this.uploadSuccess.bind(this),
			onFailure: this.uploadFailure.bind(this)
		});
	} else {
		this.controller.get('info').innerHTML = "Please select a Wallpaper";
	}
}

WizardUploadAssistant.prototype.uploadSuccess = function(response) {
	if(response.completed == false) {

	}
	if(response.completed == true && response.responseString != null) {
		if (response.responseString == "no id") {
			this.controller.get('waiting_spinner').style.display = "none";
			this.controller.get('info').innerHTML = "No id given!";
		} else if (response.responseString == "no file") {
			this.controller.get('waiting_spinner').style.display = "none";
			this.controller.get('info').innerHTML = "No file given!";
		} else if (response.responseString == "wrong format") {
			this.controller.get('waiting_spinner').style.display = "none";
			this.controller.get('info').innerHTML = "Wrong format. Only jpg/png!";
		} else if (response.responseString == "too big") {
			this.controller.get('waiting_spinner').style.display = "none";
			this.controller.get('info').innerHTML = "Image too big. Max 2MB!";
		} else if (response.responseString == "could not copy") {
			this.controller.get('waiting_spinner').style.display = "none";
			this.controller.get('info').innerHTML = "Could not copy!";
		} else {
			this.controller.get('info').innerHTML = "Success!";
			//this.controller.get('bg1').src = this.helper.bg1tmp;
			this.controller.get('waiting_spinner').style.display = "none";
			Mojo.Controller.getAppController().getStageController('main').pushScene("wizard-type");
		}
	}
}

WizardUploadAssistant.prototype.uploadFailure = function(response) {
	this.controller.get('waiting_spinner').style.display = "none";
	
	this.controller.get('info').innerHTML = "Failure";
	
	//Mojo.Controller.errorDialog("Upload Failure");
}

WizardUploadAssistant.prototype.activate = function(event) {

}

WizardUploadAssistant.prototype.deactivate = function(event) {

}

WizardUploadAssistant.prototype.cleanup = function(event) {

}
