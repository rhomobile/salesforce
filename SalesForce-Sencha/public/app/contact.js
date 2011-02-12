Ext.ns('contact', 'Ext.ux');

contact.Page = '';

// model field definition
Ext.regModel('Contact', {
	fields: ['name','id']
});

contact.DataStore = new Ext.data.JsonStore({
	autoDestroy: true,
	autoLoad: true,
	storeId: 'contactStore',

	model: 'Contact',
	sorters: 'name',
	getGroupString : function(record) {
		return record.get('name')[0];
	},
	proxy: {
		type: 'ajax',
		url: '/app/Scontact/json',
		reader: {
			type: 'json',
			root: 'contacts',
			idProperty: 'id'
		}
	},
	idProperty: 'id',
});



Ext.regModel('SingleContact', {
	fields: ['name','phone','email','id', 'account_id']
});

//contact.SingleStore = '';
contact.SingleStore = new Ext.data.JsonStore({
	autoDestroy: true,
	storeId: 'singleContactStore',

	model: 'SingleContact',
	sorters: 'name',
	getGroupString : function(record) {
		return record.get('name')[0];
	},
	proxy: {
		type: 'ajax',
		url: '/app/Scontact/json',
		reader: {
			type: 'json',
			root: 'contacts',
			idProperty: 'id'
		}
	},
	idProperty: 'id',
	listeners: {
		load: {
			fn: function(store,array,success) {
				contact.DetailForm.user = store.data.items[0];
				contact.FormPanel.loadModel(contact.DetailForm.user);
				setTimeout('contact.Page.setActiveItem(1);',50);
			}
		}
	}
});



contact.ContactList = new Ext.List({
    itemTpl: '<div class="contact2"><strong>{name}</strong></div>',
    selModel: {
        mode: 'SINGLE',
        allowDeselect: false
    },
    grouped: true,
    indexBar: true,
	listeners: {
		itemtap: function(view, index, item, e  ){ 
//				contact.DetailForm.user = view.store.data.items[index];
//				contact.FormPanel.loadModel(contact.DetailForm.user);
				contact.FormPanel.doLayout();
				item_id = view.store.data.items[index].data.id;
				contact.SingleStore.proxy.url = '/app/Scontact/json?id=' + item_id;
				contact.SingleStore.load();
		 }
	},


    store: contact.DataStore,
//	width:225,
	height: '100%'
	

});



contact.DetailForm = {
    scroll: false,
    url   : '/app/Scontact/update',
    standardSubmit : false,
    items: [
        {
            xtype: 'fieldset',
            title: 'Contact Details',
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
        }
    },

    
};

contact.FormPanel = new Ext.form.FormPanel(contact.DetailForm);


contact.SaveButton = new Ext.Button({
    text: 'Save changes',
	ui: 'confirm',
	margin: '5 25 1 25',
    iconMask: true,
    handler: function() {
        if(contact.DetailForm.user){
            contact.FormPanel.updateRecord(contact.DetailForm.user, true);
        }
        contact.FormPanel.submit({
            waitMsg : {message:'Submitting', cls : 'demos-loading'}
        })
	}
});

contact.DetailPanel = new Ext.Panel({
	id: 'contactdetail',
	// width: '100%',
	// height: '100%',
	cls: 'detailpanel',
	scroll: 'vertical',
	items: [contact.FormPanel, contact.SaveButton],
	dockedItems: [
	{
		xtype: 'toolbar',
		dock: 'bottom',
		items: [
		{
			text: 'Back',
			handler: function() {
				contact.SingleStore.proxy.url = '/app/Scontact/json';
				contact.Page.setActiveItem(0);
			}
		}
		]
	}
	]

});

contact.Page = new Ext.Panel({
			layout:"card",
			activeItem:0,
            // fullscreen: true,
            cardSwitchAnimation: 'slide',
			scroll: false,
            items: [contact.ContactList,contact.DetailPanel]
        });

// contact.Page = new Ext.Container({
// 	layout: {
// 		type: 'hbox',
// 		align: 'stretch'
// 	},
// 	items: [contact.ContactList,contact.DetailPanel]
// });