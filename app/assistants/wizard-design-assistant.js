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

function WizardDesignAssistant() {

}

WizardDesignAssistant.prototype.setup = function() {
	this.helper = new Helper();
	
	this.controller.listen(this.controller.get('next'),Mojo.Event.tap, this.nextButtonPressed.bind(this));
	
	this.designs = [];
	selectorsModel = { design: this.helper.design };
	this.controller.get('bg1').src = this.helper.bg1tmp;
	this.controller.get('bg3').src = "images/" + this.helper.design + "_" + this.helper.typetmp + ".png";

	this.controller.listen('designselector', Mojo.Event.propertyChange, this.selectorChanged.bindAsEventListener(this));
	this.controller.setupWidget('designselector', {label: $L("Design"), choices: this.designs, modelProperty:'design'}, selectorsModel);
	selectorsModel.choices = [
		{ label: "Bright", value: "Bright"},
		{ label: "Bright borderless", value: "Bright borderless"},
		{ label: "Dark", value: "Dark"},
		{ label: "Dark borderless", value: "Dark borderless"},
		{ label: "Green", value: "Green"},
		{ label: "Green borderless", value: "Green borderless"},
	];
	this.controller.modelChanged(selectorsModel);
	
	tsattr = {trueLabel: 'yes', falseLabel: 'no'};
	tsModel = {value: this.helper.tstoggle, disabled: false};
	
	this.controller.setupWidget('tstoggle', tsattr, tsModel);
}

WizardDesignAssistant.prototype.selectorChanged = function(event) {
	this.controller.get('bg3').src = "images/" + event.value + "_" + this.helper.typetmp + ".png";
	if(event.value == "Bright") {
		
	}
	if(event.value == "Dark") {
		
	}
}

WizardDesignAssistant.prototype.nextButtonPressed = function(response) {
	this.helper.designtmp = selectorsModel.design;
	this.helper.tstoggle = tsModel.value;
	this.helper.saveCookie();
	
	Mojo.Controller.getAppController().getStageController('main').pushScene("wizard-finish");
}

WizardDesignAssistant.prototype.activate = function(event) {

}

WizardDesignAssistant.prototype.deactivate = function(event) {

}

WizardDesignAssistant.prototype.cleanup = function(event) {

}
