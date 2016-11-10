function Task(data) {
    this.title = ko.observable(data.title);
    this.isDone = ko.observable(data.isDone);
}

function TaskListViewModel() {
    // Data
    var self = this;
    self.tasks = ko.observableArray([]);
    self.newTaskText = ko.observable();
    self.incompleteTasks = ko.computed(function() {
        return ko.utils.arrayFilter(self.tasks(), function(task) { return !task.isDone() });
    });
    
    // Load initial state from server, convert it to Task instances, then populate self.tasks.
    // This code takes the raw data array returned by the server and uses jQuery's $.map helper 
    // to construct a Task instance from each raw entry. 
    // The resulting array of Task objects is then pushed into the tasks array, which causes the 
    // UI to update because it's observable.
    $.getJSON("/tasks", function(allData) {
        var mappedTasks = $.map(allData, function(item) { return new Task(item) });
        self.tasks(mappedTasks);
    }); 

    // Operations
    self.addTask = function() {
        self.tasks.push(new Task({ title: this.newTaskText() }));
        self.newTaskText("");
    };
    self.removeTask = function(task) { self.tasks.remove(task) };
    
    // implement the save function with AJAX by adding an extra function to TaskListViewModel:
    // In this example, the success handler simply alerts whatever the server responds, just so 
    // you can see the server really did receive and understand the data. In a real application, 
    // you'd be more likely to show a "saved" flash message or redirect away to some other page.
    self.save = function() {
        $.ajax("/tasks", {
            data: ko.toJSON({ tasks: self.tasks }),
            type: "post", contentType: "application/json",
            success: function(result) { alert(result) }
        });
    };
}

ko.applyBindings(new TaskListViewModel()); 