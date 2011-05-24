Ext.ns('index', 'Ext.ux');

index.MainTabs = {
	activeItem: 0,
    fullscreen: true,
    type: 'dark',
    sortable: true,
	draggable: false,
	cardSwitchAnimation: 'fade',
    items: [{
        title: 'Contacts',
        items: contact.Page,
		layout: 'fit'
    }, {
        title: 'Accounts',
        items: account.Page,
		layout: 'fit'
    }],
	listeners: {
		beforecardswitch : function ( this_obj, newCard, oldCard, index, animated ) {
			this_obj.activeItem = index;
			if(global.navigating) {
				global.navigating = false;
			} else {
				global.nav_stack.push({'model':newCard.items.items[0].model_name});
				if(eval(newCard.items.items[0].model_name + ".Page.layout") != "card") {
					eval( newCard.items.items[0].model_name + ".Page.setActiveItem(0,'fade');")
				}
			}
			return true;
		}
	}
};


Ext.setup({
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    icon: 'icon.png',
    glossOnIcon: false,

    onReady: function() {
		if(rho_logged_in() == 1) {
			contact_sync_finished();
			account_sync_finished();
			account.AccountList.setLoading(true,true);
			contact.ContactList.setLoading(true,true);

        	index.Panel = new Ext.TabPanel(index.MainTabs);
			
			tabbar = index.Panel.child('tabbar');
			tabbar.add ({xtype: 'spacer'});
			tabbar.add ({
				text: 'Sync',
				handler: function() {
					//account.AccountList.setLoading(true,true);
					//contact.ContactList.setLoading(true,true);
					rho_sync();
				}
			});

			global.nav_stack.push({'model':'contact'});
			tabbar.doLayout();
		} else {
			login.Page = new Ext.Panel({
				layout:"card",
				cls:'loginPage',
				activeItem:0,
				fullscreen: true,
				cardSwitchAnimation: 'fade',
				scroll: false,
				items: [new login.MainForm()]
			});
		}
    }
});



