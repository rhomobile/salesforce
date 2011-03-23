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
				account.FormPanel.doLayout();
				account.Page.show();
				account.Page.setActiveItem(1,'fade');
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
				account.DetailForm.url = '/app/Saccount/update';
				account.DetailForm.items[0].title = "Account Details";
				account.FormPanel.doLayout();
				account.DetailPanel.remove('accountdetailform');
				account.FormPanel = new Ext.form.FormPanel(account.DetailForm);
				account.DetailPanel.insert(0,account.FormPanel);
				account.DetailPanel.doLayout();

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

account.ListPanel = new Ext.Panel({
	id: 'accountlistpanel',
	scroll: 'vertical',
	items: [ account.AccountList],
	dockedItems: [
	{
		xtype: 'toolbar',
		dock: 'bottom',
		items: [
		{
			text: 'New',
			handler: function() {
				new_account();
			}
		}
		
		]
	}
	]
	
});

function new_account(clone) {
	global.nav_stack.push({'model':'account'});
	
	account.DetailForm.url = '/app/Saccount/create';
	account.DetailForm.items[0].title = "New account";
	account.FormPanel = new Ext.form.FormPanel(account.DetailForm);
	account.FormPanel.doLayout();
	account.FormPanel.reset();

	account.DetailPanel.remove('accountdetailform');
	account.DetailPanel.insert(0,account.FormPanel);
	account.DetailPanel.doLayout();
	
	if(clone) {
		account.DetailForm.user.data.object = "";
		account.FormPanel.loadModel(account.DetailForm.user);
	}
	
	account.Page.setActiveItem(1,'fade');
}

function delete_account() {
	getPage('/app/Saccount/delete?id=' + account.DetailForm.user.data.object,false);
	account.DataStore.load();
	global.nav_stack.push({'model':'account'});
	navigate(); 
}



account.DetailForm = {
	id: 'accountdetailform',
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
				if(item.name == "object") {
					item.setVisible(false);
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
		},{
			text: 'Clone',
			handler: function() {
				new_account(true);
			}
		},{
			text: 'Delete',
			handler: function() {
				delete_account();
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
            items: [account.ListPanel,account.DetailPanel]
        });

account.Page.show();


function account_sync_finished(){
	accountfields = getPage('/app/Saccount/model',true);
	Ext.regModel('SingleAccount', {
		fields: accountfields
	});


	oldurl = account.SingleStore.proxy.url;
	
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
			url: oldurl,
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
					account.Page.show();
					account.Page.setActiveItem(1,'fade');
				}
			}
		}
	});	
	
	
	
	account.DetailForm.items[0].items = getPage('/app/Saccount/metafields',true);

	account.DetailPanel.remove('accountdetailform');
	account.FormPanel = new Ext.form.FormPanel(account.DetailForm);

	account.DetailPanel.insert(0,account.FormPanel);
	account.DetailPanel.doLayout();
	
	account.DataStore.load();
	//account.SingleStore.load();

	account.AccountList.refresh(); 
	account.AccountList.setLoading(false,true);
}
