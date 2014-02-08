wq
==

hacker's task manager

##What is this ?
A task manager meant for hackers, you can add/edit/delete tasks with this tool. This is an entirely browser based app, no server communication whatsoever.

##Why ?
I was tired of traditional task managers asking me to touch the mouse again and again. I wanted a task manager that could fit in hacker workflow. So I created wq.


##How it works ?
wq is an entirely JavaScript app. It lives in browser. It is built on angularjs. It uses localStorage as persistence layer for storing your tasks. That means **when you clear browser data, tasks will be gone**

##How to use it ?
Just head over to http://chinmaymk.github.io/wq and start using it. No logins, no signups. wq allows you to create swimlanes and tasks, you can create swimlanes to maintain state or to maintain different lists. Each tasks belongs to a swimlane. 

##Supported commands

####ns - creates a new swimlane
```javascript
ns [,swimlane name]
```

####nt - creates a new task
```javascript
nt swimlaneid [,task name]
```
####dn - Toggles done state of task
```javascript
dn swimlaneid {taskid expression}
```
####mv - Moves task from swimlane to another
```javascript
mv swimlaneid {taskid expression} swimlaneid
```
####delt - Delete a task
```javascript
delt swimlaneid {taskid expression}
```

####dels - Delete a swimlane - including tasks will be deleted as well
```javascript
dels smimlaneid
```

####eds - Edit swimlane
```javascript
eds swimlaneid [,name]
```

####edt - Edit a task
```javascript
edt swimlaneid taskid [,name]
```

####help - Get help
```javascript
help
```

**Don't forget to press return after you've entered these commands!**