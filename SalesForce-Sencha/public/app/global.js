Ext.ns('global', 'Ext.ux');

global.current_id = '';
global.current_model = '';
global.last_id = '';
global.last_model = '';
global.back_to_list = true;

global.nav_stack = new Array();

tabs = { "contact":0, "account":1};

function navigate() {
	dest = global.nav_stack[global.nav_stack.length - 1];
	model = dest['model'].toLowerCase();
	global.navigating = true;

	index.Panel.setActiveItem(tabs[model],'fade');

	if(dest['id'] && dest['id'] != '') {
		eval( model + ".FormPanel.doLayout();");
		eval( model + ".Page.setActiveItem(1);");
		eval( model + ".SingleStore.proxy.url = '/app/S" + model + "/json?id=" + dest['id'] +"';");
		eval( model + ".SingleStore.load();");
		
	} else {
		eval( model + ".Page.setActiveItem(0);");
	}
	
}

function go_back() {
	global.nav_stack.pop();
	navigate();
}

