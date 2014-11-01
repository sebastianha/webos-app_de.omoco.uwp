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

CALLBACKFUNCTION = null;

function Helper() {
	var cookie = new Mojo.Model.Cookie("UWP");
	var Prefs = cookie.get();
	if(Prefs != null)
	{
		this.nduid = Prefs.nduid;
		this.bg1 = Prefs.bg1;
		this.bg1tmp = Prefs.bg1tmp;
		this.bg2 = Prefs.bg2;
		this.bg2tmp = Prefs.bg2tmp;
		this.type = Prefs.type;
		this.typetmp = Prefs.typetmp;
		this.design = Prefs.design;
		this.designtmp = Prefs.designtmp;
		this.attr = Prefs.attr;
		this.attrtmp = Prefs.attrtmp;
		this.unit = Prefs.unit;
		this.unittmp = Prefs.unittmp;
		this.refreshtime = Prefs.refreshtime;
		this.onofftoggle = Prefs.onofftoggle;
		this.donatetoggle = Prefs.donatetoggle;
		this.tstoggle = Prefs.tstoggle;
	} else {
		var date = new Date();
		var timestamp = date.getTime();
		this.nduid = timestamp + "_" + Math.round(Math.random()*999999999);
		this.bg1 = "";
		this.bg1tmp = "";
		this.bg2 = "";
		this.bg2tmp = "";
		this.type = "Weather";
		this.typetmp = "Weather";
		this.design = "Bright";
		this.designtmp = "Bright";
		this.attr = "";
		this.attrtmp = "";
		this.unit = "";
		this.unittmp = "";
		this.refreshtime = "6 hours";
		this.onofftoggle = false;
		this.donatetoggle = true;
		this.tstoggle = false;
		this.saveCookie();
		Mojo.Controller.getAppController().getStageController('main').pushScene("wizard-upload");
	}
}

Helper.prototype.saveCookie = function() {
	var cookie = new Mojo.Model.Cookie("UWP");
	cookie.put({
		nduid: this.nduid,
		bg1: this.bg1,
		bg1tmp: this.bg1tmp,
		bg2: this.bg2,
		bg2tmp: this.bg2tmp,
		type: this.type,
		typetmp: this.typetmp,
		design: this.design,
		designtmp: this.designtmp,
		attr: this.attr,
		attrtmp: this.attrtmp,
		unit: this.unit,
		unittmp: this.unittmp,
		refreshtime: this.refreshtime,
		onofftoggle: this.onofftoggle,
		donatetoggle: this.donatetoggle,
		tstoggle: this.tstoggle
	});
}

Helper.prototype.refreshBG = function(callback) {
	CALLBACKFUNCTION = callback;
	
	var updatetime = "";
	if (this.tstoggle) {
		var timestamp = new Date();
		var hours = timestamp.getHours();
		if (hours.toString().length < 2) 
			hours = "0" + hours;
		var minutes = timestamp.getMinutes();
		if (minutes.toString().length < 2) 
			minutes = "0" + minutes;
		updatetime = hours + ":" + minutes;
	}
	
	new Mojo.Service.Request('palm://com.palm.downloadmanager/', {
		method: 'download', 
		parameters: {
			target: "http://uwps.omoco.de/uwps/download.php?id=" + this.nduid + "&design=" + escape(this.design) + "&type=" + escape(this.type) + "&attr=" + escape(this.attr) + "&unit=" + escape(this.unit) + "&ts=" +  updatetime,
			"mime" : "image/png",
			"targetDir" : "/media/internal/",
			"targetFilename" : "uwp.jpg",
			subscribe: true
		},
		onSuccess : this.downloadWallpaperSuccess.bind(this),
		onFailure : this.downloadWallpaperFailure.bind(this)
	});
}

Helper.prototype.downloadWallpaperSuccess = function(response) {
	if(response.completed == false) {

	}
	if (response.completed == true) {
		this.setButtonPressed("/media/internal/uwp.jpg");
	}
}

Helper.prototype.downloadWallpaperFailure = function(response) {
	//Mojo.Controller.errorDialog("Download Failure");
}

Helper.prototype.refreshBGtmp = function() {
	new Mojo.Service.Request('palm://com.palm.downloadmanager/', {
		method: 'download', 
		parameters: {
			target: "http://uwps.omoco.de/uwps/download.php?id=" + this.nduid + "_tmp" + "&design=" + escape(this.designtmp) + "&type=" + escape(this.typetmp) + "&attr=" + escape(this.attrtmp) + "&unit=" + escape(this.unittmp),
			"mime" : "image/png",
			"targetDir" : "/media/internal/",
			"targetFilename" : "uwptmp.png",
			subscribe: true
		},
		onSuccess : this.downloadWallpaperSuccesstmp.bind(this),
		onFailure : this.downloadWallpaperFailuretmp.bind(this)
	});
}

Helper.prototype.downloadWallpaperSuccesstmp = function(response) {
	if(response.completed == false) {

	}
	if (response.completed == true) {

		this.bg2tmp = "/media/internal/uwptmp.png?" + new Date().getTime();
		Mojo.Controller.getAppController().getStageController('main').get('bg4').src = this.bg2tmp;
		this.saveCookie();
	}
}

Helper.prototype.downloadWallpaperFailuretmp = function(response) {
	//Mojo.Controller.errorDialog("Download Failure");
}

Helper.prototype.setButtonPressed = function(wallpaperfile) {
	new Mojo.Service.Request('palm://com.palm.systemservice/wallpaper', {
		method: "importWallpaper",
		parameters: {
			"target": "file://" + wallpaperfile
		},
		onSuccess: this.importWallpaperSuccess.bind(this),
		onFailure: this.importWallpaperFailure.bind(this)
	});
}

Helper.prototype.importWallpaperSuccess = function(response) {
	if(response.wallpaper)
		this.setWallpaper(response.wallpaper);
	//else
		//Mojo.Controller.errorDialog("Import Failure 2");
}

Helper.prototype.setWallpaper = function(wallpaperInfo) {
	new Mojo.Service.Request('palm://com.palm.systemservice/', {
		method:"setPreferences",
		parameters:{
	        wallpaper: wallpaperInfo
	    },
		onSuccess: this.setWallpaperSuccess,
	    onFailure: this.setWallpaperFailure
	});
}

Helper.prototype.setWallpaperSuccess = function(response) {
	if (CALLBACKFUNCTION != null) {
		CALLBACKFUNCTION();
		CALLBACKFUNCTION = null;
	}
}

Helper.prototype.setWallpaperFailure = function(response) {
	//Mojo.Controller.errorDialog("Set Failure");
}

Helper.prototype.importWallpaperFailure = function(response) {
	//Mojo.Controller.errorDialog("Import Failure");
}

Helper.prototype.setWakeUp = function(refreshtime) {
	var hours = refreshtime.split(" ")[0];
	
	var date = new Date();
	var newAlarmTime = new Date(date.getTime() + (hours*60*60*1000));
	
	var newAlarmDate = "";
	var Aday = newAlarmTime.getUTCDate();
	if(Aday.toString().length < 2)
		Aday = "0" + Aday;
	var Amonth = newAlarmTime.getUTCMonth()+1;
	if(Amonth.toString().length < 2)
		Amonth = "0" + Amonth;
	var Ayear = newAlarmTime.getUTCFullYear();
	var Ahours = newAlarmTime.getUTCHours();
	if(Ahours.toString().length < 2)
		Ahours = "0" + Ahours;
	var Aminutes = newAlarmTime.getUTCMinutes();
	if(Aminutes.toString().length < 2)
		Aminutes = "0" + Aminutes;
	var Aseconds = newAlarmTime.getUTCSeconds();
	if(Aseconds.toString().length < 2)
		Aseconds = "0" + Aseconds;
	
	newAlarmDate = Amonth + "/" + Aday + "/" + Ayear + " " + Ahours + ":" + Aminutes + ":" + Aseconds;
	
	Mojo.Log.error(" ********** " + newAlarmDate + " ***********");
	
	new Mojo.Service.Request('palm://com.palm.power/timeout', {
		method: "set",
 		parameters: {
			"wakeup": false,
			"key": "com.de.omoco.uwp.timer",
			"uri": "palm://com.palm.applicationManager/open",
			"params": { 'id': 'de.omoco.uwp', 'params': {'setwallpaper': '1'}},
			"at": newAlarmDate
		},
		onSuccess: function(response){},
		onFailure: function(response){}
 	});
}

Helper.prototype.delWakeUp = function() {
	new Mojo.Service.Request('palm://com.palm.power/timeout', {
		method: "clear",
 		parameters: { "key" : "com.de.omoco.uwp.timer" }
	});
}