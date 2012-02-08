
// fill in url when creating
// url   : '/app/Scontact/update',
// also requires formTitle
// and formItems

crm.DetailForm = Ext.extend(Ext.form.FormPanel, {
    scroll: false,
    standardSubmit : false,
	initComponent: function() {
		    this.items = [
		        {
		            xtype: 'fieldset',
		            title: this.formTitle,
		            instructions: 'Please enter the information above.',
					width: 300,
		            defaults: {
		//                required: true,
		                labelAlign: 'left',
		                labelWidth: '35%'
		            },
		            items: this.formItems
		        }
		    ];
			crm.DetailForm.superclass.initComponent.call(this);
	}
	
//Fill in listeners when instantiated.
		//     listeners : {
		// 	    submit : function(form, result){
		// 	global.nav_stack.push({'model':'contact'});
		// 	navigate();
		// 	contact.DataStore.load();
		// 	contact.ContactList.refresh(); 
		// 
		// 	    },	
		// 
		//         exception : function(form, result){
		// 	global.nav_stack.push({'model':'contact'});
		// 	navigate();
		// 	contact.DataStore.load();
		// 	contact.ContactList.refresh(); 
		// 	
		//         },
		// afterlayout : function() {
		// 	this.items.items[0].items.items.forEach(function(item){
		// 		if(item.link_to && item.link_to != "") {
		// 			if(item.value == "") {
		// 				item.setVisible(false);
		// 			} else {
		// 				item.setVisible(true);
		// 			}
		// 		}
		// 		if(item.name == "object") {
		// 			item.setVisible(false);
		// 		}
		// 	});
		// }
		//     },

    
});
