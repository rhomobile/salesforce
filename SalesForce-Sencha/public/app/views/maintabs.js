//need to pass in items
//items: 
crm.MainTabs = Ext.extend(Ext.TabPanel,{
	activeItem: 0,
    fullscreen: true,
    type: 'dark',
    sortable: true,
	draggable: false,
	cardSwitchAnimation: 'fade',
	listeners: {
		beforecardswitch : function ( this_obj, newCard, oldCard, index, animated ) {
			this_obj.activeItem = index;
			if(global.navigating) {
				global.navigating = false;
			} else {
				global.nav_stack.push({'model':newCard.items.items[0].model_name});
				if(eval(newCard.items.items[0].model_name + ".Page.layout") != "card") {
					newCard.getComponent(0).setActiveItem(0,'fade');
				}
			}
			return true;
		}
	}
});