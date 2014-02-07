wq
==

hacker's task manager


ns - new swimlane
	ns [,swimlane name]
nt - new task -
	nt swimlaneid [,task name]

Toggles done state of task
dn swimlaneid {taskid expression}

Moves task from swimlane to another
mv swimlaneid {taskid expression} swimlaneid

Delete a task
delt swimlaneid {taskid expression}

Delete a swimlane - including tasks will be deleted as well
dels smimlaneid

Edit swimlane
eds swimlaneid [,name]

Edit a task
edt swimlaneid taskid [,name]

Get help
help
