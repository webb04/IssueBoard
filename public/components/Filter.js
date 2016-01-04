var Filter = React.createClass({
  render: function(){
    var attributes = {};
    this.props.issues.map(function(issue) {
      for (var key in issue) {
        if (!attributes[key])
          attributes[key] = [];

        attributes[key].push(issue[key]);
      }
    })
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index && value != "";
    }
    for (var key in attributes) {
      attributes[key] = attributes[key].filter(onlyUnique);
    }
    var selectedFilters = this.props.selectedFilters.slice();
    var paramButtonMarkup = [];
    for (var key in attributes) {
      if (key == 'description' || key == 'id') continue
      paramButtonMarkup.push(<h4 className="filter-attribute-title">{key}</h4>);
      attributes[key].map(function(item) {
        if (selectedFilters.indexOf(item) > -1) {
          paramButtonMarkup.push(<div className="param-button selected">{item}</div>);
        } else {
          paramButtonMarkup.push(<div className="param-button">{item}</div>);
        }
      });
    }

    return (<div>
        <div className="filter-attribute-wrapper">
          <div className="attribute-row">
            <div className="clear-button" onClick={this.props.onClear}>Clear</div>
          </div>
          <div className="attribute-row">
            <div onClick={this.props.onClick}>
            {paramButtonMarkup}
          </div>
          </div>
      </div>
    </div>);
  }
});
