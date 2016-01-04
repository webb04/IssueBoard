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
    var initialIssues = this.state.initialIssues;
    var newList = [];
    var flag = false;

    // if already present, remove
    if (selectedFilters.indexOf(e.target.innerHTML) > -1) {
      selectedFilters.splice(selectedFilters.indexOf(e.target.innerHTML), 1);
      if (selectedFilters.length == 0) {
        this.setState({selectedIssues: this.state.initialIssues});
      } else {
          initialIssues.map(function(issue){
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
    } else {
      selectedFilters.push(e.target.innerHTML);
      if (selectedFilters.length == 1) {
        initialIssues.map(function(issue){
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
        initialIssues.map(function(issue){
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
