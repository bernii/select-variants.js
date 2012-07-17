####################################################
#                                                  #
#  Select-Variants.js                              #
#  Variant Selector Widget v0.2  by Bernard Kobos  #
#                                                  #
####################################################

# Features:
# - you provide variants via simple JS interface, it does the rest
# - renders HTML form
# - customizable: default value, validation messages
# - infinite number of variants
# - pure JS, not dependant on any JavaScript library

# I. What is it?

# It is a simple set of classes that allow you to create a multi-variant
# selector widget in HTML and its interaction.

# Let's assume that you have a product that you would like to configure on your webpage.
# For example:
# ProductA -> width: XXL, height: 100
# ProductB -> width: XXL, height: 80
# ProductC -> width: M, height: 100
# ProductD -> width: M, height: 70

# User should not be able to select a product that has width=M and height=80.
# This is purpose of that widget. It ensures in real-time that only valid options
# can be selected and shows which options are now available (if user selected width=M,
# he can only select height 100 or 70 as 80 is grayed out) 

# II. Demo
#  - That's cool, but can you show me how it really works?
#  - Sure, just check out the demo here: http://jsfiddle.net/berni/tDDfj/ or run demo.html on your desktop/device.


# III. How to use it?

# Hey, that's easy!
# Place some basic html on you webpage, like:
# <div id="form-container"></div>

# Add a pinch of JavaScript:

# v = new Variants
# v.add({
#     size: 1,
#     color: "red"
#   }, {id: "SKU1", price: 50})
# v.add({
#     size: 0.5,
#     color: "white"
#   }, {id: "SKU2", price: 40})
# v.add({
#     size: 1,
#     color: "black"
#   }, {id: "SKU3", price: 35})
# VariantForm.defaultValue = "please select a value";
# vf = new VariantForm(v , document.getElementById("form-container"));

# BooM! And the magic happens ;)
# Just check out the demo.html or live demo at JsFiddle: http://jsfiddle.net/berni/tDDfj/

# Helper cloning function
cloneObject = (obj) ->
    clone = {}
    for k of obj
        if typeof(obj[k])== "object"
            clone[k] = cloneObject(obj[i])
        else
            clone[k] = obj[k]
    return clone

# Holding all the available variants and data corresponding to each one
class Variants
	_variants: []
	names: []
	# Add new variant
	add: (variant, values) ->
		for name of variant
			if not (name in @names)
				@names.push(name)
		@_variants.push(new Variant(variant, values))
	# Get variant 
	get: (variant) ->
		if variant of @_variants
			return @_variants[variant]
		return 0
	# Add conditional check
	# Example: You may want to consider variants as valid only those whose quantity > 0...
	_checks: []
	addCheck: (checkFunction) -> 
		@_checks.push(checkFunction)
	# Get variant corresponding to selected values
	getVariant: (selected_vals) ->
		for variant in @_variants
			all_value_equal = true
			for key of variant.variant
				val = variant.variant[key] + ""
				quantity = variant.quantity

				checkResult = false
				for checkFunc in @_checks
					checkResult = checkFunc(variant)
					if checkResult
						break
				
				if selected_vals[key] and selected_vals[key] != val or checkResult
					all_value_equal = false

			if all_value_equal
				return variant
		return null
	# Get available variant names
	getTypes: () ->
		return @names
	# Get all available variants
	getVariants: (name, current_state=null) ->
		variants = []
		that = @
		in_variants = (val) ->
			for variant in variants
				if variant.value == val
					return true
			return false
		is_available = (name, val) ->
			if current_state
				selected_vals = cloneObject(current_state)
			else
				selected_vals = {}
			selected_vals[name] = val + ""
			for k of selected_vals
				if selected_vals[k] == VariantForm.defaultValue
					delete selected_vals[k]

			if that.getVariant(selected_vals)
				return true
			return false

		for elem in @_variants
			if name of elem.variant and not in_variants(elem.variant[name])
				variants.push({value: elem.variant[name], available: is_available(name, elem.variant[name])})
		return variants

# Using it internally to instantiate variant <-> value pairs
class Variant
	constructor: (@variant, @values) ->

	getVal: (name) ->
		return @values[name]

# Main class that allows you to define possible variants, handles rendering and all the interactions
class VariantForm
	@defaultValue: "select val"
	_change_listers: []

	constructor: (@quantity, @el) ->
		@render()

	getCurrentVariant: () ->
		return @quantity.getVariant(@getCurrentState())
	# Select element change handler
	selectChange: (elem) ->
		# re-render (check quantities)
		variant = @quantity.getVariant(@getCurrentState())
		for listener in @_change_listers
			listener(variant)
		
		@render(@getCurrentState())
	# Observerable pattern - add listener that will be notified when there is a change
	addChangeListener: (listener) ->
		@_change_listers.push(listener)
	# Get current state of the selected variant
	getCurrentState: () ->
		current_state = {}
		for node in @el.getElementsByTagName("select")
			current_state[node.name] = node.value
		return current_state
	# Submit handler used for testing
	submit: () ->
		# If all selects selected show product ID
		that = @
		selectedNonDefault = () ->
			i = 0
			for elem in that.el.getElementsByTagName("select")
				for opt in elem.children
					if opt.value != VariantForm.defaultValue and opt.selected
						i += 1
						break
			return i
		if @el.getElementsByTagName("select").length == selectedNonDefault()
			variant = @quantity.getVariant(@getCurrentState())
			alert("The selected object id is " + variant.getVal("id") + " price: " + variant.getVal("price") + " q: " + variant.getVal("quantity"))
		else # If not all selectes selected, inform user
			alert("Sorry man!")
	# Rendering function
	render: (current_state=null) ->
		_html = ""
		for type in @quantity.getTypes()
			_html += "<label>" + type + "<select name='" + type + "'><option>" + VariantForm.defaultValue + "</option>"
			for variant in @quantity.getVariants(type, current_state)
				extra = ""
				if not variant.available
					extra = " disabled='disabled'"
				if current_state and current_state[type] == variant.value + ""
					extra += " selected='selected'"
				_html += "<option" + extra + " value='" + variant.value + "'>" + variant.value + "</option>"
			_html += "</select></label>"

		@el.innerHTML = _html
		that = @
		for elem in @el.getElementsByTagName("select")
			elem.onchange = () -> that.selectChange.call(that, @)

# Register globals
window.VariantForm = VariantForm
window.Variants = Variants
