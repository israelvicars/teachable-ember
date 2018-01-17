import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('teachable-camera', 'Integration | Component | teachable camera', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{teachable-camera}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#teachable-camera}}
      template block text
    {{/teachable-camera}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
