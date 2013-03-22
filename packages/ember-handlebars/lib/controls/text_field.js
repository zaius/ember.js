require("ember-handlebars/ext");
require("ember-views/views/view");
require("ember-handlebars/controls/text_support");
require('ember-runtime/mixins/target_action_support');

/**
@module ember
@submodule ember-handlebars
*/

var get = Ember.get, set = Ember.set;

/**
  The `Ember.TextField` view class renders a text
  [input](https://developer.mozilla.org/en/HTML/Element/Input) element. It
  allows for binding Ember properties to the text field contents (`value`),
  live-updating as the user inputs text.

  Example:

  ```handlebars
  {{view Ember.TextField valueBinding="firstName"}}
  ```

  ## Layout and LayoutName properties

  Because HTML `input` elements are self closing `layout` and `layoutName`
  properties will not be applied. See `Ember.View`'s layout section for more
  information.

  ## HTML Attributes

  By default `Ember.TextField` provides support for `type`, `value`, `size`,
  `pattern`, `placeholder`, `disabled`, `maxlength` and `tabindex` attributes
  on a test field. If you need to support more attributes have a look at the
  `attributeBindings` property in `Ember.View`'s HTML Attributes section.

  To globally add support for additional attributes you can reopen
  `Ember.TextField` or `Ember.TextSupport`.

  ```javascript
  Ember.TextSupport.reopen({
    attributeBindings: ["required"]
  })
  ```

  @class TextField
  @namespace Ember
  @extends Ember.View
  @uses Ember.TextSupport
*/
Ember.TextField = Ember.View.extend(Ember.TargetActionSupport, Ember.TextSupport,
  /** @scope Ember.TextField.prototype */ {

  classNames: ['ember-text-field'],
  tagName: "input",
  attributeBindings: ['type', 'value', 'size', 'pattern', 'name'],

  /**
    The `value` attribute of the input element. As the user inputs text, this
    property is updated live.

    @property value
    @type String
    @default ""
  */
  value: "",

  /**
    The `type` attribute of the input element.

    @property type
    @type String
    @default "text"
  */
  type: "text",

  /**
    The `size` of the text field in characters.

    @property size
    @type String
    @default null
  */
  size: null,

  /**
    The `pattern` the pattern attribute of input element.

    @property pattern
    @type String
    @default null
  */
  pattern: null,

  /**
    The action to be sent when the user presses the return key.

    This is similar to the `{{action}}` helper, but is fired when
    the user presses the return key when editing a text field, and sends
    the value of the field as the context.

    @property action
    @type String
    @default null
  */
  action: null,

  /**
    The target object to send the action to.

    @property target
    @type String
    @default null
  */
  target: 'controller',

  /**
    Whether they `keyUp` event that triggers an `action` to be sent continues
    propagating to other views.

    By default, when the user presses the return key on their keyboard and
    the text field has an `action` set, the action will be sent to the view's
    controller and the key event will stop propagating.

    If you would like parent views to receive the `keyUp` event even after an
    action has been dispatched, set `bubbles` to true.

    @property bubbles
    @type Boolean
    @default false
  */
  bubbles: false,


  /**
    @private

    Overrides `TargetActionSupport`'s `triggerAction` function to pass the
    value as first argument, and the view as the second.

    @property triggerAction
  */
  triggerAction: function() {
    var action = get(this, 'action'),
    target = get(this, 'targetObject');

    if (target && action) {
      var ret;

      if (typeof target.send === 'function') {
        ret = target.send(action, get(this, 'value'), this);
      } else {
        if (typeof action === 'string') {
          action = target[action];
        }
        ret = action.call(target, get(this, 'value'), this);
      }
      if (ret !== false) ret = true;

      return ret;
    } else {
      return false;
    }
  },


  insertNewline: function(event) {
    if (this.triggerAction()) {
      if (!get(this, 'bubbles')) {
        event.stopPropagation();
      }
    }
  }
});
