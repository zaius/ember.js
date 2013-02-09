var Model;

module("Ember.Model", {
  setup: function() {
    Model = Ember.Model.extend({
      name: Ember.attr()
    });
    Model.adapter = Ember.FixtureAdapter.create();
    Model.FIXTURES = [
      {id: 1, name: 'Erik'}
    ];
  },
  teardown: function() {

  }
});

test("can define attributes with Ember.attr, data is accessible", function() {
  var instance = Model.create({name: "Erik"});

  equal(instance.get('name'), "Erik", "Property value was retained");
});

// test("coercion", function() {
// });

test(".find(id) delegates to the adapter's find method", function() {
  expect(3);

  var record = Model.find(1);
  ok(record, "Record was returned by find");
  stop();

  record.on('didLoad', function() {
    start();
    equal(record.get('name'), 'Erik', "Loaded value is accessible from the record");
    ok(record.get('isLoaded'), "Record isLoaded");
  });
});

test(".find() delegates to the adapter's findAll method", function() {
  expect(2);

  var records = Model.find();
  ok(records instanceof Ember.RecordArray, "RecordArray is returned");
  stop();

  records.on('didLoad', function() {
    start();
    debugger;
    // equal(records.get('firstObject.id'), 1); // TODO: built-in CP for primaryKey
    equal(records.get('firstObject.name'), 'Erik');
  });
});

test(".find(id) called multiple times returns the same object (identity map)", function() {
  expect(1);

  var first = Model.find(1),
      second = Model.find(1);

  equal(first, second);
});

test("creating a new record adds it to existing record arrays", function() {
  expect(1);

  var records = Model.find();
  var record = Model.create({id: 2, name: 'Yehuda'});
  record.save();
  stop();

  record.on('didSaveRecord', function() {
    start();
    equal(records.get('length'), 2, "The record array was updated");
  });
  
});

test("destroying a record removes it from record arrays", function() {
  expect(2);

  var records = Model.find();
  stop();
  records.on('didLoad', function() {
    start();
    equal(records.get('length'), 1, "The record array was updated");
    var record = Model.find(1);
    record.deleteRecord();
    stop();
    record.on('didDeleteRecord', function() {
      start();
      equal(records.get('length'), 0, "The record array was updated");
    });
  });
});

test("record isNew & isSaving flags", function() {
  expect(5);

  var record = Model.create();
  ok(record.get('isNew'));

  record.save();
  ok(record.get('isNew'));
  ok(record.get('isSaving'));

  stop();

  record.on('didSaveRecord', function() {
    start();
    ok(!record.get('isNew'));
    ok(!record.get('isSaving'));
  });
});


test("record.toJSON() is generated from Ember.attr definitions", function() {
  expect(1);

  var record = Model.find(1);
  record.on('didLoad', function() {
    start();
    deepEqual(record.toJSON(), {name: 'Erik'});
  });
  stop();
});