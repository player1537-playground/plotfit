describe("plotfit.expr()", function() {
  function withinTimeLimit(milliseconds, done, callback) {
    var errTimeout = setTimeout(function() {
      done(new Error("Timeout error"));
    }, milliseconds);

    return function() {
      clearTimeout(errTimeout);
      callback();
      done();
    };
  }

  it("should have reasonable defaults", function() {
    var expr = plotfit.expression();

    expect(expr.parameters()).to.be.empty;
    expect(expr.scope()).to.be.empty;
    expect(expr.defaultValue()).to.be.equal(0);
    expect(expr.expr()).to.be.null;

  });

  it("should should respect parameters", function() {
    var expr = plotfit.expression()
          .parameters(['foo'])
          .expr('foo+bar');

    expect(expr.scope()).to.have.property('bar');
    expect(expr.scope()).to.not.have.property('foo');

  });

  it("should be able to evaluate constant expression", function() {
    var expr = plotfit.expression()
          .expr('1234');

    expect(expr()).to.be.equal(1234);
    expect(expr.scope()).to.be.empty;

  });

  it("should be able to evaluate linear expression", function() {
    var expr = plotfit.expression()
          .parameters(['x'])
          .expr('2x+3');

    expect(expr(2)).to.be.equal(2*2+3);
    expect(expr(3)).to.be.equal(2*3+3);
    expect(expr.scope()).to.be.empty;

  });

  it("should be able to read from scope", function() {
    var expr = plotfit.expression()
          .expr('foo')
          .scope({ foo: 1234 });

    expect(expr()).to.be.equal(1234);
    expect(expr.scope()).to.have.property('foo', 1234);

  });

  it("should trigger change when expr changed", function(done) {
    var expr = plotfit.expression();

    expr.on('change', withinTimeLimit(1000, done, function() {
      expect(expr.expr()).to.be.equal('1234');
    }));

    expr.expr('1234');

  });

  it("should produce a textual representation of expression", function() {
    var expr = plotfit.expression().expr('1+2*3^4');

    expect(expr.textExpr()).to.be.equal('1 + 2 * 3 ^ 4');
  });

  it("should convert scope variables to numbers in textExpr", function() {
    var expr = plotfit.expression()
          .expr('a+b*c^d')
          .scope({ a: 1, b: 2, c: 3, d: 4 });

    expect(expr.textExpr()).to.be.equal('1 + 2 * 3 ^ 4');
  });

  it("should serialize its state", function() {
    var expr = plotfit.expression()
          .defaultValue(1)
          .parameters(['x'])
          .expr('m*x+b')
          .scope({ m: 2, b: 3 });

    expect(expr.serialize()).to.deep.equal({
      parameters: ['x'],
      scope: { m: 2, b: 3 },
      defaultValue: 1,
      expr: 'm*x+b',
    });
  });

  it("should deserialize its state", function() {
    var expr = plotfit.expression()
          .serialize({
            parameters: ['x'],
            scope: { m: 2, b: 3 },
            defaultValue: 1,
            expr: 'm*x+b',
          });

    expect(expr.parameters()).to.deep.equal(['x']);
    expect(expr.scope()).to.deep.equal({ m: 2, b: 3 });
    expect(expr.defaultValue()).to.equal(1);
    expect(expr.expr()).to.equal('m*x+b');
  });
});

describe.skip("Rescaling functions", function() {
  var xScale = __configuration.xScale(),
      yScale = __configuration.yScale(),
      fitting = __configuration.fitting();

  function setValue(text, selector) {
    var inputEvent = new Event('input'),
        elem = $(selector),
        old = elem.val();

    elem.val(text).get(0).dispatchEvent(inputEvent);
    return old;
  }

  function withinTimeLimit(milliseconds, done, callback) {
    var errTimeout = setTimeout(function() {
      done(new Error("Timeout error"));
    }, milliseconds);

    return function() {
      clearTimeout(errTimeout);
      callback();
      done();
    };
  }

  beforeEach(function(done) {
    xScale.on('change.mocha', function() {
      done();
    });

    __configuration('Reset');
  });

  it("should default to Q for xScale", function() {
    expect($("#x-axis-settings input").val()).to.be.equal("Q");
  });

  it("should emit 'change' when text box is changed", function(done) {
    xScale.on('change.mocha', withinTimeLimit(1000, done, function() {
      expect(xScale.expr()).to.be.equal("Q^2");
    }));

    setValue("Q^2", "#x-axis-settings input");

  });

  it("should add variables when text box contains them", function(done) {
    xScale.on('change.mocha', withinTimeLimit(1000, done, function() {
      expect(xScale.expr()).to.be.equal("Q^a");
      expect(xScale.scope()).to.have.property('a');
    }));

    expect(xScale.scope()).to.not.have.property('a');

    setValue("Q^a", "#x-axis-settings input");

  });

  it("should be reset back to default before each test", function() {
    expect($("#x-axis-settings input").val()).to.be.equal("Q");
  });

});
