select-variants.js / coffee
===========================
**Variant Selector Widget v0.2**

Features:
 * you provide variants via simple JS interface, it does the rest
 * renders HTML form, handles updates and interactions
 * customizable: default value, validation messages
 * infinite number of variants
 * pure JS, not dependant on any JavaScript library

## I. What is it?

It is a simple set of classes that allow you to create a multi-variant
selector widget in HTML and its interaction.

Let's assume that you have a product that you would like to configure on your webpage.
For example:
**ProductA** -> *width*: XXL, *height*: 100
**ProductB** -> *width*: XXL, *height*: 80
**ProductC** -> *width*: M, *height*: 100
**ProductD** -> *width*: M, *height*: 70

User should not be able to select a product that has *width*=**M** and *height*=**80**.
This is purpose of that widget. It ensures in real-time that only valid options
can be selected and shows which options are now available (if user selected width=M,
he can only select height 100 or 70 as 80 is grayed out) 

## II. Demo
 - That's cool, but can you show me how it really works?
 - Sure, just check out the demo here: http://jsfiddle.net/berni/tDDfj/ or run demo.html on your browser (Look into the source, Luke).


## III. How to use it?

Hey, that's easy!
Place some basic html on you webpage, like:
```html
<div id="form-container"></div>
```
Add a pinch of JavaScript:
```javascript
v = new Variants
v.add({
    size: 1,
    color: "red"
  }, {id: "SKU1", price: 50})
v.add({
    size: 0.5,
    color: "white"
  }, {id: "SKU2", price: 40})
v.add({
    size: 1,
    color: "black"
  }, {id: "SKU3", price: 35})
VariantForm.defaultValue = "please select a value";
vf = new VariantForm(v , document.getElementById("form-container"));
```
Ofcourse don't forget to link to select-variant.min.js inside your HTML page.
BooM! And the magic happens ;)

## IV. Want to know more?
Just check out the demo.html or live demo at [JsFiddle](http://jsfiddle.net/berni/tDDfj/).
Also, feel free to [contact me](berni+githubsv@extensa.pl) if you have some thoughts, problems or you just want to say hi ;)
