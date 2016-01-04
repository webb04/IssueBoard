var List = React.createClass({
  render: function(){
    return (
      <div>
      {
        this.props.issues.map(function(issue) {
          return (
            <div key={issue.id} className="issue-card-wrapper">
              <div className="issue-card">
                <div className="issue-overlay">
                  <p className="completed-button">Completed</p>
                </div>
                <h2 className="card-title">{issue.project}</h2>
                <div className="assignee-wrapper">
                  <img className="user-icon" src="img/user.png"/>
                  <p className="card-assignee">{issue.assignee}</p>
                </div>
                <p className="card-description">{issue.description}</p>
                <AdditionalAttributes issue={issue}/>
                <div className="card-footer">
                  <p className="left">{issue.id}</p>
                  <p className="right">{issue.category}</p>
                </div>
              </div>
            </div>
          )})
       }
     </div>
    )}
});
