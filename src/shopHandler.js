'use strict';
import { so } from './soundObject';
import Shop from './shop';
import { MenuItem, EditItem, SliderItem, MenuTypes } from './menuItem';
import { Menu } from './menu';
import SettingsLoader from './settingsLoader';
import ScrollingText from './scrollingText';
class ShopHandler {
	constructor(stats, callback) {
		
		var that = this;
		this.stats = stats;
		this.shop = new Shop(this.stats, function(success, stats) { that.updateStats(success, stats); });
		this.menu = 0;
		this.callback = callback;
		this.sndPurchase = so.create("ui/shopPurchaseSuccess");
		this.sndUnablePurchase = so.create("ui/shopPurchaseFailure");
		this.settingsLoader = new SettingsLoader();
		this.toBuy = null;
		this.createMenu();
	}
	
	createMenu() {
		var items = new Array();
		for (var i in this.shop.items) {
			var item = new MenuItem(this.shop.items[i].id, this.shop.items[i].name + ", " + this.shop.items[i].price + " coins");
			items.push(item);
		}
		items.push(new MenuItem(999, "Leave"));
		this.menu = new Menu("Select an option", items);
		var that = this;
		this.menu.run(function(event) { that.handleEvent(event); });
	}
	handleEvent(event) {
		this.menu.destroy();
		if (event.selected == 999) {
			
			this.callback(this.stats);
			return;
		}
		
		if (this.shop.items[event.cursor].sound != 0) {
			var sound = so.create(this.shop.items[event.selected].sound);
			sound.play();
		}
		this.showDescription(event.selected);
	}
	
	showDescription(number) {
		this.itemToBuy = number;
		number = this.shop.findItemByID(this.itemToBuy);
		console.log("Buying " + this.itemToBuy);
		var descriptionItem = new MenuItem(0, this.shop.items[number].description);
		var purchaseItem = new MenuItem(1, "Buy for " + this.shop.items[number].price);
		var goBackItem = new MenuItem(2, "Go back");
		var that = this;
		this.menu = new Menu(this.shop.items[number].name, [descriptionItem, purchaseItem, goBackItem]);
		this.menu.run(function(event) { that.handlePurchase(event); });
	}
	handlePurchase(event) {
		this.menu.destroy();
		if (event.selected == 2) {
			
			this.createMenu();
		} else {
			this.shop.purchaseItem(this.itemToBuy);
		}
	}
	
	updateStats(success, stats) {
		var that = this;
		if (success == true) {
			this.sndPurchase.play();
			new ScrollingText("Purchase complete!", "\n", function() { that.createMenu(); });
		} else if (success == false) {
			this.sndUnablePurchase.play();
			new ScrollingText("Not enough money!", "\n", function() { that.createMenu(); });
		} else {
			new ScrollingText("You already have this!", "\n", function() { that.createMenu(); });
		}
		
		this.stats = stats;
		this.settingsLoader.saveStats(this.stats);
		// this.createMenu();
	}
	
}

export default ShopHandler;
