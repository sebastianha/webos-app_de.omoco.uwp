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

function MainAssistant() {

}

MainAssistant.prototype.setup = function() {
	this.appMenuModel = {
		visible: true,
		items: [
			{ label: $L("Preferences"), command: 'preferences' },
			{ label: $L("Help / FAQ"), command: 'tutorial' },
			{ label: $L("About"), command: 'about' },
			{ label: $L("Credits"), command: 'credits' }
		]
	};
	
	this.controller.setupWidget(Mojo.Menu.appMenu, {omitDefaultItems: true}, this.appMenuModel);
	
	this.helper = new Helper();
	
	//this.controller.listen(this.controller.get('refresh'),Mojo.Event.tap, this.refreshButtonPressed.bind(this));
	this.controller.listen(this.controller.get('wizard'),Mojo.Event.tap, this.wizardButtonPressed.bind(this));
	
	this.refreshtimes = [];
	selectorsModelRTime = { refreshtime: this.helper.refreshtime };

	this.controller.listen('refreshtimeselector', Mojo.Event.propertyChange, this.selectorChanged.bindAsEventListener(this));
	this.controller.setupWidget('refreshtimeselector', {label: $L("Refresh Interval"), choices: this.refreshtimes, modelProperty:'refreshtime'}, selectorsModelRTime);
	selectorsModelRTime.choices = [
		{ label: "1 hour", value: "1 hour"},
		{ label: "2 hours", value: "2 hours"},
		{ label: "4 hours", value: "4 hours"},
		{ label: "6 hours", value: "6 hours"},
		{ label: "12 hours", value: "12 hours"},
		{ label: "24 hours", value: "24 hours"},
	];
	this.controller.modelChanged(selectorsModelRTime);
	
	tattr = {trueLabel: 'True', falseLabel: 'False'};
	tModel = {value: this.helper.onofftoggle, disabled: false};
	
	this.controller.setupWidget('onofftoggle', tattr, tModel);
	Mojo.Event.listen(this.controller.get('onofftoggle'),Mojo.Event.propertyChange,this.togglePressed.bind(this));
	
	this.spinnerLAttrs = {spinnerSize: 'large'};
	this.spinnerModel = {spinning: true};
	this.controller.setupWidget('waiting_spinner2', this.spinnerLAttrs, this.spinnerModel);
	
	if(this.helper.donatetoggle)
		this.controller.get('donatemessage').style.display = "block";
		
	var url = "http://omoco.de/uwps/info.txt";
	var request = new Ajax.Request(url, {
		method: 'get',
		evalJSON: 'false',
		onSuccess: this.requestSuccess.bind(this),
		onFailure: this.requestFailure.bind(this)
	});
}

MainAssistant.prototype.togglePressed = function(event) {
	this.helper.onofftoggle = tModel.value;
	this.helper.saveCookie();
	
	if(tModel.value == true) {
		this.helper.setWakeUp(this.helper.refreshtime);
		this.controller.get('waiting_spinner').style.display = "block";
		this.helper.refreshBG(this.bgRefreshed.bind(this));
	} else {
		this.helper.delWakeUp();
		this.helper.setButtonPressed(this.helper.bg1);
	}
}

MainAssistant.prototype.bgRefreshed = function(){
	this.controller.get('waiting_spinner').style.display = "none";
}

MainAssistant.prototype.selectorChanged = function(event) {
	this.helper.refreshtime = selectorsModelRTime.refreshtime;
	this.helper.saveCookie();
	
	if(tModel.value == true) {
		this.helper.setWakeUp(this.helper.refreshtime);
	} else {
		this.helper.delWakeUp();
	}
}

MainAssistant.prototype.wizardButtonPressed = function(event) {
	Mojo.Controller.getAppController().getStageController('main').pushScene("wizard-upload");
}

/*MainAssistant.prototype.refreshButtonPressed = function(event) {
	this.controller.get('info').innerHTML = "Refreshing wallpaper. This may take some time. Do not close the app.";
	this.helper.refreshBG();
}*/

MainAssistant.prototype.activate = function(event) {
	this.helper = new Helper();
	tModel.value = this.helper.onofftoggle;
	this.controller.modelChanged(tModel);
}

MainAssistant.prototype.deactivate = function(event) {

}

MainAssistant.prototype.cleanup = function(event) {

}

MainAssistant.prototype.handleCommand = function(event){
    if(event.type == Mojo.Event.command) {	
		switch (event.command) {
			case 'tutorial':
				Mojo.Controller.getAppController().getStageController('main').pushScene("tutorial");
				break;
			case 'preferences':
				Mojo.Controller.getAppController().getStageController('main').pushScene("preferences");
				break;
			case 'about':
				Mojo.Controller.getAppController().getStageController('main').pushScene("about");
				break;
			case 'credits':
				Mojo.Controller.getAppController().getStageController('main').pushScene("credits");
				break;
		}
	}
}

MainAssistant.prototype.requestSuccess = function(resp){
	if(resp.responseText != "")
		this.showDialogBox($L("Message"), resp.responseText);
}

MainAssistant.prototype.requestFailure = function(resp){
}

MainAssistant.prototype.showDialogBox = function(title,message) {
	this.controller.showAlertDialog({
		onChoose: function(value) {},
		title:title,
		message:message,
		allowHTMLMessage: true,
		choices:[ {label:'OK', value:'OK', type:'color'} ]
	});
}