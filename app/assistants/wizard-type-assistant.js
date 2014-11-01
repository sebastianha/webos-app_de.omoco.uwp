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

function WizardTypeAssistant() {

}

WizardTypeAssistant.prototype.setup = function() {
	this.helper = new Helper();
	
	this.controller.listen(this.controller.get('next'),Mojo.Event.tap, this.nextButtonPressed.bind(this));
	
	this.types = [];
	selectorsModelType = { type: this.helper.type };
	this.controller.get('bg1').src = this.helper.bg1tmp;
	this.controller.get('bg2').src = "images/" + this.helper.design + "_" + this.helper.type + ".png";
	if(this.helper.type == "Test") {
		this.controller.get('attributes').innerText = "Nothing to fill in here";
	}
	if(this.helper.type == "Weather") {
		this.controller.get('attributes').innerText = "City for local weather";
		this.controller.get('unitdiv').style.display = "block";
	}
	if(this.helper.type == "News") {
		this.controller.get('attributes').innerText = "Newsfeed URL (RSS)";
	}
	if(this.helper.type == "Stocks") {
		this.controller.get('attributes').innerText = "Stocks (space separated)";
	}
	
	this.controller.listen('typeselector', Mojo.Event.propertyChange, this.selectorChanged.bindAsEventListener(this));
	this.controller.setupWidget('typeselector', {label: $L("Type"), choices: this.types, modelProperty:'type'}, selectorsModelType);
	selectorsModelType.choices = [
		{ label: "Weather", value: "Weather"},
		{ label: "News", value: "News"},
		{ label: "Stocks", value: "Stocks"},
		{ label: "Test", value: "Test"},
	];
	this.controller.modelChanged(selectorsModelType);
	
	var textattr = {
		hintText: '',
		textFieldName: 'name', 
		modelProperty: 'original', 
		multiline: false,
		focus: false, 
		maxLength: 150,
	};
	textmodel = {
		'original' : this.helper.attr,
		disabled: false
	};
	this.controller.setupWidget('textattributes', textattr, textmodel);
	
	tuattr = {trueLabel: 'Celsius', falseLabel: 'Fahrenheit', trueValue: 'c', falseValue: ''};
	tuModel = {value: this.helper.unit, disabled: false};
	
	this.controller.setupWidget('unittoggle', tuattr, tuModel);
}

WizardTypeAssistant.prototype.selectorChanged = function(event) {
	this.controller.get('bg2').src = "images/" + this.helper.design + "_" + event.value + ".png";
	this.controller.get('unitdiv').style.display = "none";
	if(event.value == "Test") {
		this.controller.get('attributes').innerText = "Nothing to fill in here";
	}
	if(event.value == "Weather") {
		this.controller.get('attributes').innerText = "City for local weather";
		this.controller.get('unitdiv').style.display = "block";
	}
	if(event.value == "News") {
		this.controller.get('attributes').innerText = "Newsfeed URL (RSS)";
	}
	if(event.value == "Stocks") {
		this.controller.get('attributes').innerText = "Stocks (space separated)";
	}
}

WizardTypeAssistant.prototype.nextButtonPressed = function(response) {
	this.helper.attrtmp = textmodel['original'];
	this.helper.typetmp = selectorsModelType.type;
	this.helper.unittmp = tuModel.value;
	this.helper.saveCookie();
	
	Mojo.Controller.getAppController().getStageController('main').pushScene("wizard-design");
}

WizardTypeAssistant.prototype.activate = function(event) {

}

WizardTypeAssistant.prototype.deactivate = function(event) {

}

WizardTypeAssistant.prototype.cleanup = function(event) {

}
