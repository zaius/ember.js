Ember.RecordArray = Ember.ArrayProxy.extend(Ember.Evented, Ember.DeferredMixin, {
  isLoaded: false,

  load: function(klass, data) {
    this.set('content', this.materializeData(klass, data));
    this.set('isLoaded', true);
    this.trigger('didLoad');
    this.resolve(this);
  },

  materializeData: function(klass, data) {
    return Ember.A(data.map(function(el) {
      return klass.findFromCacheOrLoad(el); // FIXME
    }));
  }
});