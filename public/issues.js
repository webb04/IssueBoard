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

var IssueBoard = React.createClass({
  getInitialState: function(){
     return {
       initialIssues: [],
       selectedIssues: [],
       filterParamsShowing: false,
       selectedFilters: [],
       currentSearchTerm: ""
     }
  },
  filterList: function(e){
    this.setState({
      selectedFilters: [],
      currentSearchTerm: e.target.value.toLowerCase()
    });

    var updatedList = this.state.initialIssues;
    updatedList = updatedList.filter(function(issue){
      var issueString = JSON.stringify(issue);
      return (
        issueString.toLowerCase().search(e.target.value.toLowerCase()) !== -1
      );
    });
    this.setState({selectedIssues: updatedList});
  },
  componentWillMount: function(){
    $.get("/api/issues", function(result) {
      // handle nulls
      var filteredInput = JSON.stringify(result).replace(/null/g, '""');
      filteredInput = JSON.parse(filteredInput);
      if (this.isMounted()) {
        this.setState({
          selectedIssues: filteredInput,
          initialIssues: filteredInput
        });
      }
    }.bind(this));
  },
  handleFilter: function() {
    if (this.state.currentSearchTerm != "") {
      this.setState({
        filterParamsShowing: !this.state.filterParamsShowing,
        selectedFilters: [],
        selectedIssues: this.state.initialIssues,
        currentSearchTerm: ""
      });
    } else {
      this.setState({
        filterParamsShowing: !this.state.filterParamsShowing
      });
    }
  },
  handleClear: function() {
    this.setState({
      selectedIssues: this.state.initialIssues,
      selectedFilters: []
    });
  },
  handleChildClick: function(e) {
    if (e.target.className.indexOf("param-button") == -1) return

    var selectedFilters = this.state.selectedFilters.slice();
    var updatedList = this.state.initialIssues;
    var newList = [];
    var flag = false;

    // if already present, remove
    if (selectedFilters.indexOf(e.target.innerHTML) > -1) {
      selectedFilters.splice(selectedFilters.indexOf(e.target.innerHTML), 1);

      if (selectedFilters.length == 0) {
        this.setState({selectedIssues: this.state.initialIssues});
      } else {
          updatedList.map(function(issue){
            flag = false;
            var issueString = JSON.stringify(issue);
            for (var key in selectedFilters) {
              if (issueString.indexOf(selectedFilters[key]) > -1) {
                flag = true;
              } else {
                flag = false;
                break;
              }
            }
            if (flag) newList.push(issue);
          });
          this.setState({selectedIssues: newList});
      }
    }
    else {
      selectedFilters.push(e.target.innerHTML);
      if (selectedFilters.length == 1) {
        updatedList.map(function(issue){
          flag = false;
          var issueString = JSON.stringify(issue);
          for (var key in selectedFilters) {
            if (issueString.indexOf(selectedFilters[key]) > -1) {
              flag = true;
            }
          }
          if (flag) newList.push(issue);
        });
        this.setState({selectedIssues: newList});
      } else {
        flag = false;
        updatedList.map(function(issue){
          flag = false;
          var issueString = JSON.stringify(issue);
          for (var key in selectedFilters) {
            if (issueString.indexOf(selectedFilters[key]) > -1) {
              flag = true;
            } else {
              flag = false;
              break;
            }
          }
          if (flag) newList.push(issue);
        });
        this.setState({selectedIssues: newList});
      }
    }
    this.setState({selectedFilters: selectedFilters});
  },
  render: function(){
    var filterButtons, filterHeaderButton;
    if (this.state.filterParamsShowing) {
      filterButtons = <Filter issues={this.state.selectedIssues}
        onClick={this.handleChildClick} selectedFilters={this.state.selectedFilters}
        onClear={this.handleClear} />
      filterHeaderButton = <div className="filter-button selected"
        onClick={this.handleFilter}>
        Filter
      </div>
    } else {
      filterHeaderButton = <div>
        <input className="filter-list-item" type="text"
        placeholder="Search" onChange={this.filterList}/>
        <div className="filter-button"
          onClick={this.handleFilter}>Filter
        </div>
      </div>
    }

    return (
      <div className="filter-list">
        <div className="filter-list-search">
          <img className="filter-list-item" src="img/duedil_logo_main.png"/>
          {filterHeaderButton}
        </div>
        {filterButtons}
        <div className="issues-wrapper">
          <List issues={this.state.selectedIssues} />
        </div>
      </div>
    );
  }
});

ReactDOM.render(<IssueBoard/>, document.getElementById('content-wrapper'));
