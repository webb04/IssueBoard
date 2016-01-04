var AdditionalAttributes = React.createClass({
  render: function(){
    var additionalAttributes = [];
    var issue = this.props.issue;
    for (var key in issue) {
      if (!(key == 'id' || key == 'description' || key == 'category'
      || key == 'assignee' || key == 'description' || key == 'project')) {
        additionalAttributes.push(issue[key]);
      }
    }
    return (
      <div>
          {
            additionalAttributes.map(function(attribute) {
              return (
                <p key={attribute} className="card-description">{attribute}</p>
              )
            })
          }
      </div>
    );
  }
});
