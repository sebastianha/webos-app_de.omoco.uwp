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

function AppAssistant() {
}

AppAssistant.prototype.setup = function() {
}

AppAssistant.prototype.handleLaunch = function(launchParams){
   var appController = Mojo.Controller.getAppController();
   var cardStageController = appController.getStageController('main');
   
   if (!launchParams) {
   		SILENT = false;
	
   		//Mojo.Log.error(" ********** NO PARAMS ***********");
		if (cardStageController) {
			//Mojo.Log.error(" ********** ACTIVATE ***********");
			cardStageController.activate();
		}
		else {
			//Mojo.Log.error(" ********** PUSH ***********");
			var pushMainScene = function(stageController){
				stageController.pushScene('main');
				//stageController.pushScene('wizard-upload');
			}
			var stageArgs = {
				name: 'main',
        	    lightweight: true
        	};
        	this.controller.createStageWithCallback(stageArgs, pushMainScene.bind(this), 'card');
		}
	} else {
   		//Mojo.Log.error(" ********** PARAMS ***********");
		
	    try {
			if(launchParams.setwallpaper != null)
			{
				this.helper = new Helper();
				this.helper.refreshBG(null);
				this.helper.setWakeUp(this.helper.refreshtime);
			}
		} 
		catch (err) {}
	}
}