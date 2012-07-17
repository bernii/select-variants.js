(function() {
  var Variant, VariantForm, Variants, cloneObject;
  var __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
  cloneObject = function(obj) {
    var clone, k;
    clone = {};
    for (k in obj) {
      if (typeof obj[k] === "object") {
        clone[k] = cloneObject(obj[i]);
      } else {
        clone[k] = obj[k];
      }
    }
    return clone;
  };
  Variants = (function() {
    function Variants() {}
    Variants.prototype._variants = [];
    Variants.prototype.names = [];
    Variants.prototype.add = function(variant, values) {
      var name;
      for (name in variant) {
        if (!(__indexOf.call(this.names, name) >= 0)) {
          this.names.push(name);
        }
      }
      return this._variants.push(new Variant(variant, values));
    };
    Variants.prototype.get = function(variant) {
      if (variant in this._variants) {
        return this._variants[variant];
      }
      return 0;
    };
    Variants.prototype._checks = [];
    Variants.prototype.addCheck = function(checkFunction) {
      return this._checks.push(checkFunction);
    };
    Variants.prototype.getVariant = function(selected_vals) {
      var all_value_equal, checkFunc, checkResult, key, quantity, val, variant, _i, _j, _len, _len2, _ref, _ref2;
      _ref = this._variants;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        variant = _ref[_i];
        all_value_equal = true;
        for (key in variant.variant) {
          val = variant.variant[key] + "";
          quantity = variant.quantity;
          checkResult = false;
          _ref2 = this._checks;
          for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
            checkFunc = _ref2[_j];
            checkResult = checkFunc(variant);
            if (checkResult) {
              break;
            }
          }
          if (selected_vals[key] && selected_vals[key] !== val || checkResult) {
            all_value_equal = false;
          }
        }
        if (all_value_equal) {
          return variant;
        }
      }
      return null;
    };
    Variants.prototype.getTypes = function() {
      return this.names;
    };
    Variants.prototype.getVariants = function(name, current_state) {
      var elem, in_variants, is_available, that, variants, _i, _len, _ref;
      if (current_state == null) {
        current_state = null;
      }
      variants = [];
      that = this;
      in_variants = function(val) {
        var variant, _i, _len;
        for (_i = 0, _len = variants.length; _i < _len; _i++) {
          variant = variants[_i];
          if (variant.value === val) {
            return true;
          }
        }
        return false;
      };
      is_available = function(name, val) {
        var k, selected_vals;
        if (current_state) {
          selected_vals = cloneObject(current_state);
        } else {
          selected_vals = {};
        }
        selected_vals[name] = val + "";
        for (k in selected_vals) {
          if (selected_vals[k] === VariantForm.defaultValue) {
            delete selected_vals[k];
          }
        }
        if (that.getVariant(selected_vals)) {
          return true;
        }
        return false;
      };
      _ref = this._variants;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elem = _ref[_i];
        if (name in elem.variant && !in_variants(elem.variant[name])) {
          variants.push({
            value: elem.variant[name],
            available: is_available(name, elem.variant[name])
          });
        }
      }
      return variants;
    };
    return Variants;
  })();
  Variant = (function() {
    function Variant(variant, values) {
      this.variant = variant;
      this.values = values;
    }
    Variant.prototype.getVal = function(name) {
      return this.values[name];
    };
    return Variant;
  })();
  VariantForm = (function() {
    VariantForm.defaultValue = "select val";
    VariantForm.prototype._change_listers = [];
    function VariantForm(quantity, el) {
      this.quantity = quantity;
      this.el = el;
      this.render();
    }
    VariantForm.prototype.getCurrentVariant = function() {
      return this.quantity.getVariant(this.getCurrentState());
    };
    VariantForm.prototype.selectChange = function(elem) {
      var listener, variant, _i, _len, _ref;
      variant = this.quantity.getVariant(this.getCurrentState());
      _ref = this._change_listers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        listener = _ref[_i];
        listener(variant);
      }
      return this.render(this.getCurrentState());
    };
    VariantForm.prototype.addChangeListener = function(listener) {
      return this._change_listers.push(listener);
    };
    VariantForm.prototype.getCurrentState = function() {
      var current_state, node, _i, _len, _ref;
      current_state = {};
      _ref = this.el.getElementsByTagName("select");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        current_state[node.name] = node.value;
      }
      return current_state;
    };
    VariantForm.prototype.submit = function() {
      var selectedNonDefault, that, variant;
      that = this;
      selectedNonDefault = function() {
        var elem, i, opt, _i, _j, _len, _len2, _ref, _ref2;
        i = 0;
        _ref = that.el.getElementsByTagName("select");
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          elem = _ref[_i];
          _ref2 = elem.children;
          for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
            opt = _ref2[_j];
            if (opt.value !== VariantForm.defaultValue && opt.selected) {
              i += 1;
              break;
            }
          }
        }
        return i;
      };
      if (this.el.getElementsByTagName("select").length === selectedNonDefault()) {
        variant = this.quantity.getVariant(this.getCurrentState());
        return alert("The selected object id is " + variant.getVal("id") + " price: " + variant.getVal("price") + " q: " + variant.getVal("quantity"));
      } else {
        return alert("Sorry man!");
      }
    };
    VariantForm.prototype.render = function(current_state) {
      var elem, extra, that, type, variant, _html, _i, _j, _k, _len, _len2, _len3, _ref, _ref2, _ref3, _results;
      if (current_state == null) {
        current_state = null;
      }
      _html = "";
      _ref = this.quantity.getTypes();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        type = _ref[_i];
        _html += "<label>" + type + "<select name='" + type + "'><option>" + VariantForm.defaultValue + "</option>";
        _ref2 = this.quantity.getVariants(type, current_state);
        for (_j = 0, _len2 = _ref2.length; _j < _len2; _j++) {
          variant = _ref2[_j];
          extra = "";
          if (!variant.available) {
            extra = " disabled='disabled'";
          }
          if (current_state && current_state[type] === variant.value + "") {
            extra += " selected='selected'";
          }
          _html += "<option" + extra + " value='" + variant.value + "'>" + variant.value + "</option>";
        }
        _html += "</select></label>";
      }
      this.el.innerHTML = _html;
      that = this;
      _ref3 = this.el.getElementsByTagName("select");
      _results = [];
      for (_k = 0, _len3 = _ref3.length; _k < _len3; _k++) {
        elem = _ref3[_k];
        _results.push(elem.onchange = function() {
          return that.selectChange.call(that, this);
        });
      }
      return _results;
    };
    return VariantForm;
  })();
  window.VariantForm = VariantForm;
  window.Variants = Variants;
}).call(this);
