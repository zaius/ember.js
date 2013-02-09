require('ember-model/adapter');

Ember.FixtureAdapter = Ember.Adapter.extend({
  find: function(record, id) {
    var fixtures = record.constructor.FIXTURES,
        data = Ember.A(fixtures).find(function(el) { return el.id === id; });

    if (!record.get('isLoaded')) {
      setTimeout(function() {
        record.load(id, data);
      });
    }
  },

  findAll: function(klass, records) {
    var fixtures = klass.FIXTURES;

    setTimeout(function() {
      records.load(klass, fixtures);
    });
  },

  saveRecord: function(record) {
    setTimeout(function() {
      Ember.run(record, record.didSaveRecord);
    });
  },

  deleteRecord: function(record) {
    setTimeout(function() {
      Ember.run(record, record.didDeleteRecord);
    });
  }
});