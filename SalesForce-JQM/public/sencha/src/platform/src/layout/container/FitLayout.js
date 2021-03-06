/**
 * @class Ext.layout.FitLayout
 * @extends Ext.layout.ContainerLayout
 * <p>This is a base class for layouts that contain <b>a single item</b> that automatically expands to fill the layout's
 * container.  This class is intended to be extended or created via the <tt>layout:'fit'</tt> {@link Ext.Container#layout}
 * config, and should generally not need to be created directly via the new keyword.</p>
 * <p>FitLayout does not have any direct config options (other than inherited ones).  To fit a panel to a container
 * using FitLayout, simply set layout:'fit' on the container and add a single panel to it.  If the container has
 * multiple panels, only the first one will be displayed.</p>
 */
Ext.layout.FitLayout = Ext.extend(Ext.layout.ContainerLayout, {
    itemCls: 'x-fit-item',
    targetCls: 'x-layout-fit',
    type: 'fit',
    
    // @private
    onLayout : function() {
        Ext.layout.FitLayout.superclass.onLayout.call(this);

        if (this.owner.items.length) {
            var box = this.getTargetBox(),
                item = this.owner.items.get(0);
            
            this.setItemBox(item, box);
            item.cancelAutoSize = true;
        }
    },

    getTargetBox : function() {
        var target = this.getTarget(),
            size = target.getSize(),
            padding = {
                left: target.getPadding('l'),
                right: target.getPadding('r'),
                top: target.getPadding('t'),
                bottom: target.getPadding('b')
            }, 
            border = {
                left: target.getBorderWidth('l'),
                right: target.getBorderWidth('r'),
                top: target.getBorderWidth('t'),
                bottom: target.getBorderWidth('b')
            };
            
        return {
            width: size.width- padding.left - padding.right - border.left - border.right,
            height: size.height - padding.top - padding.bottom - border.top - border.bottom,
            x: padding.left + border.left,
            y: padding.top + border.top
        };        
    },
    
    // @private
    setItemBox : function(item, box) {
        if (item && box.height > 0) {
            box.width -= item.el.getMargin('lr');
            //box.width = null;
            box.height -= item.el.getMargin('tb');
            item.setCalculatedSize(box);
            item.setPosition(box);
        }
    }
});

Ext.regLayout('fit', Ext.layout.FitLayout);
