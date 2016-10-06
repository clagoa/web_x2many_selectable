odoo.define('web_x2many_selectable.form_widgets', function(require) {
	"use strict";
	var core = require('web.core');
	var Model = require('web.Model');
	var _t = core._t;
	var QWeb = core.qweb;
	var FieldOne2Many = core.form_widget_registry.get('one2many');

	var X2ManySelectable = FieldOne2Many.extend({
		multi_selection : false,

		/* Se sobreescribe el constructor padre para que procese el atributo
		 * actions, a través del cual, se le pasará el listado de acciones a 
		 * incluir en el menubuton.
		 * 
		 * El atributo actions será un listado de elementos con las siguientes
		 * propiedades:
		 * 		name: nombre del método del modelo a llamar
		 * 		string: etiqueta a mostrar en el boton
		 * 		separator: (bool) si debe añadir un separador despues de la accion 
		 * */
		init : function(field_manager, node) {			
			var self = this;	
			
			self.actions = [];
			if (node && node.attrs && node.attrs.actions) {
				self.actions = JSON.parse(node.attrs.actions);	
				_.each(self.actions, function(action) {
					action.id = _.uniqueId('ep_button_');
				});
			}	
			this.id = _.uniqueId('x2manyselectable_');
			
			this._super.apply(this, arguments);
		},
		
		/* Se sobreescribe el método para suscribirnos al cambio de modo de la
		 * vista, para poder controlar cuando se pone en modo editable.		 * 
		 */
		start : function() {
			this._super.apply(this, arguments);					
			
			var self = this;
			self.field_manager.on("change:actual_mode", self, self.check_actual_mode);
            self.check_actual_mode();
		},				
			
		/* Función suscriptora del cambio de modo. Cambia el modo de lista a
		 * seleccionable o no en función de si el formulario esta editable o no
		 * */
		check_actual_mode: function(source, options) {
		    var self = this;
		    if(self.field_manager.get("actual_mode")=='edit'){
		    	self.multi_selection = true;
		    	self.views[0].options.selectable = true;
		    }
		    else {
		    	self.multi_selection = false;
		    	self.views[0].options.selectable = false;
		    }
		},
		
		/* Se sobreescribe el método para poder añadir el menubuton con las 
		 * acciones al poner la vista en modo editable
		 * */
		reload_current_view: function() {
			var self = this;					
			
			if (this.view.get('actual_mode') == 'edit') {				
				var $th_actions = this.$el.find('th.oe_list_record_delete').first();
				var actions_exists = $th_actions.find('#' + self.id).length > 0;
				if(!actions_exists && $th_actions && $th_actions.length == 1) {
					
					self.$button_el = $('<div id="' + self.id + '">');
					self.$button_el.append(QWeb.render("X2ManySelectable", {
						widget : this
					}));
					
					_.each(self.actions, function(action){
						self.$button_el.find("#" + action.id).click(function() {
							self.action_selected_lines(action);
						});
					});	
					
					$th_actions.append(self.$button_el);
				}
			}			
						
			return this._super.apply(this, arguments);			
		},
		
		action_selected_lines : function(action) {
			var self = this;
			var selected_ids = self.get_selected_ids_one2many();
			if (selected_ids.length === 0) {
				this.do_warn(_t("You must choose at least one record."));
				return false;
			}
			
			var model_obj = new Model(this.dataset.model); 			
			model_obj.call(action.name, [ selected_ids ], {
				context : self.dataset.context
			}).then(function(result) {
				if (action.reload && (action.reload === '1')) {
					self.view.reload();
				}
			});
		},
		get_selected_ids_one2many : function() {
			var ids = [];
			this.$el.find('th.oe_list_record_selector input:checked').closest(
					'tr').each(function() {
				ids.push(parseInt($(this).context.dataset.id));
			});
			return ids;
		},
	});
	core.form_widget_registry.add('x2many_selectable', X2ManySelectable);
	return X2ManySelectable;
});
