describe("Rescaling functions", function() {
  function setValue(text, selector) {
    var inputEvent = new Event('input'),
        elem = $(selector),
        old = elem.val();

    elem.val(text).get(0).dispatchEvent(inputEvent);
    return old;
  }

  it("should default to Q for xScale", function() {
    expect($("#x-axis-settings input").val()).to.be.equal("Q");
  });

  it("should emit 'change' when text box is changed", function(done) {
    var errTimeout = setTimeout(function() {
      done(new Error("Timeout error"));
    }, 1000);

    var spy = function() {
      clearTimeout(errTimeout);
      expect(__configuration.xScale().expr()).to.be.equal("Q^2");
      done();
    };

    __configuration.xScale().on('change.mocha', spy);

    setValue("Q^2", "#x-axis-settings input");

    //expect(spy).to.have.been.calledOnce;
  });

  it("should add variables when text box contains them", function(done) {
    var errTimeout = setTimeout(function() {
      done(new Error("Timeout error"));
    }, 1000);

    var spy = function() {
      clearTimeout(errTimeout);
      expect(__configuration.xScale().expr()).to.be.equal("Q^a");
      expect(__configuration.xScale().scope()).to.have.property('a');
      done();
    };

    expect(__configuration.xScale().scope()).to.not.have.property('a');
    __configuration.xScale().on('change.mocha', spy);

    setValue("Q^a", "#x-axis-settings input");

  });
});
