require('ember-model/adapter');
require('ember-model/record_array');

var get = Ember.get,
    set = Ember.set;

Ember.Model = Ember.Object.extend(Ember.Evented, {
  isLoaded: false,
  isNew: true,

  load: function(id, data) {
    set(this, 'data', Ember.merge({id: id}, data));
    set(this, 'isLoaded', true);
    this.trigger('didLoad');
  },

  didDefineProperty: function(proto, key, value) {
    if (value instanceof Ember.Descriptor) {
      var meta = value.meta();

      if (meta.isAttribute) {
        if (!proto.attributes) { proto.attributes = []; }
        proto.attributes.push(key);
      }
    }
  },

  toJSON: function() {
    return this.getProperties(this.attributes);
  },

  save: function() {
    set(this, 'isSaving', true);
    this.constructor.adapter.saveRecord(this);
  },

  didSaveRecord: function() {
    if (get(this, 'isNew')) {
      set(this, 'isNew', false);
    }
    set(this, 'isSaving', false);
    this.constructor.addToRecordArrays(this);
    this.trigger('didSaveRecord');
  },

  deleteRecord: function() {
    this.constructor.adapter.deleteRecord(this);
  },

  didDeleteRecord: function() {
    this.constructor.removeFromRecordArrays(this);
    this.trigger('didDeleteRecord');
  }
});

Ember.Model.reopenClass({
  adapter: Ember.Adapter.create(),

  find: function(id) {
    if (!arguments.length) {
      return this.findAll();
    } else {
      return this.findById(id);
    }
  },

  findAll: function() {
    var records = Ember.RecordArray.create();

    if (!this.recordArrays) { this.recordArrays = []; }
    this.recordArrays.push(records);
    
    this.adapter.findAll(this, records);
    
    return records;
  },

  findById: function(id) {
    var record = this.cachedRecordForId(id);
    get(this, 'adapter').find(record, id);
    return record;
  },

  cachedRecordForId: function(id) {
    if (!this.recordCache) { this.recordCache = {}; }
    var record = this.recordCache[id] || this.create();
    if (!this.recordCache[id]) { this.recordCache[id] = record; }
    return record;
  },

  addToRecordArrays: function(record) {
    if (this.recordArrays) {
      this.recordArrays.forEach(function(recordArray) {
        recordArray.pushObject(record);
      });
    }
  },

  removeFromRecordArrays: function(record) {
    if (this.recordArrays) {
      this.recordArrays.forEach(function(recordArray) {
        recordArray.removeObject(record);
      });
    }
  },

  // FIXME
  findFromCacheOrLoad: function(data) {
    var record = this.cachedRecordForId(data.id);
    set(record, 'data', data);
    return record;
  }
});