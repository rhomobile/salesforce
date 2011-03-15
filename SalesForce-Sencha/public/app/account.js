Ext.ns('account', 'Ext.ux');

account.Page = '';

// model field definition
Ext.regModel('Account', {
	fields: ['name','id']
});

account.DataStore = new Ext.data.JsonStore({
	autoDestroy: true,
	autoLoad: true,
	storeId: 'accountStore',

	model: 'Account',
	sorters: 'name',
	getGroupString : function(record) {
		return record.get('name')[0];
	},
	proxy: {
		type: 'ajax',
		url: '/app/Saccount/json',
		reader: {
			type: 'json',
			root: 'accounts',
			idProperty: 'id'
		}
	},
	idProperty: 'id',
});



Ext.regModel('SingleAccount', {
	fields: ['name','phone','email','id', 'account_id']
});

//account.SingleStore = '';
account.SingleStore = new Ext.data.JsonStore({
	autoDestroy: true,
	storeId: 'singleAccountStore',

	model: 'SingleAccount',
	sorters: 'name',
	getGroupString : function(record) {
		return record.get('name')[0];
	},
	proxy: {
		type: 'ajax',
		url: '/app/Saccount/json',
		reader: {
			type: 'json',
			root: 'accounts',
			idProperty: 'id'
		}
	},
	idProperty: 'id',
	listeners: {
		load: {
			fn: function(store,array,success) {
				account.DetailForm.user = store.data.items[0];
				account.FormPanel.loadModel(account.DetailForm.user);
				setTimeout("account.Page.setActiveItem(1,'fade');",50);
			}
		}
	}
});



account.AccountList = new Ext.List({
    itemTpl: '<div class="account2"><strong>{name}</strong></div>',
    selModel: {
        mode: 'SINGLE',
        allowDeselect: false
    },
    grouped: true,
    indexBar: true,
	listeners: {
		itemtap: function(view, index, item, e  ){ 
				account.FormPanel.doLayout();
				item_id = view.store.data.items[index].data.id;
				
				global.nav_stack.push({'id':item_id, 'model':'account'});

				account.SingleStore.proxy.url = '/app/Saccount/json?id=' + item_id;
				account.SingleStore.load();
		 }
	},


    store: account.DataStore,
//	width:225,
	height: '100%'
	

});



account.DetailForm = {
    scroll: false,
    url   : '/app/Saccount/update',
    standardSubmit : false,
    items: [
        {
            xtype: 'fieldset',
            title: 'Account Details',
            instructions: 'Please enter the information above.',
			width: 300,
            defaults: {
//                required: true,
                labelAlign: 'left',
                labelWidth: '35%'
            },
            items: [
            {
                xtype: 'textfield',
                name : 'name',
                label: 'Name',
                useClearIcon: true,
                autoCapitalize : false
            }, {
	            xtype: 'textfield',
	            name : 'phone',
	            label: 'Phone',
	            useClearIcon: true,
	            autoCapitalize : false
	        }, {
                xtype: 'emailfield',
                name : 'email',
                label: 'Email',
                placeHolder: 'john@example.com',
                useClearIcon: true
            }, 	{
                xtype: 'hiddenfield',
                name : 'id',
                label: 'id'
	        }]
        }
    ],
    listeners : {
        submit : function(form, result){
            console.log('success', Ext.toArray(arguments));
        },
        exception : function(form, result){
            console.log('failure', Ext.toArray(arguments));
        },
		afterlayout : function() {
			this.items.items[0].items.items.forEach(function(item){
				if(item.link_to && item.link_to != "") {
					if(item.value == "") {
						item.setVisible(false);
					} else {
						item.setVisible(true);
					}
				}
			});
		}
    },

    
};

account.FormPanel = new Ext.form.FormPanel(account.DetailForm);


account.SaveButton = new Ext.Button({
    text: 'Save changes',
	ui: 'confirm',
	margin: '5 25 1 25',
    iconMask: true,
    handler: function() {
        if(account.DetailForm.user){
            account.FormPanel.updateRecord(account.DetailForm.user, true);
        }
        account.FormPanel.submit({
            waitMsg : {message:'Submitting', cls : 'demos-loading'}
        })
	}
});

account.DetailPanel = new Ext.Panel({
	id: 'accountdetail',
	// width: '100%',
	// height: '100%',
	cls: 'detailpanel',
	scroll: 'vertical',
	items: [account.FormPanel, account.SaveButton],
	dockedItems: [
	{
		xtype: 'toolbar',
		dock: 'bottom',
		items: [
		{
			text: 'Back',
			handler: function() {
				go_back();
			}
		}
		]
	}
	]

});

account.Page = new Ext.Panel({
			layout:"card",
			activeItem:0,
            // fullscreen: true,
			model_name:'account',

            cardSwitchAnimation: 'fade',
			scroll: false,
            items: [account.AccountList,account.DetailPanel]
        });

account.Page.show();

// account.Page = new Ext.Container({
// 	layout: {
// 		type: 'hbox',
// 		align: 'stretch'
// 	},
// 	items: [account.AccountList,account.DetailPanel]
// });