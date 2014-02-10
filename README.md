wq
==

hacker's task manager

##What is this ?
A task manager meant for hackers, you can add/edit/delete tasks with this tool. This is an entirely browser based app, no server communication whatsoever.

![hackers's task manager](https://raw2.github.com/chinmaymk/wq/master/img/wq.PNG)

##Why ?
I was tired of traditional task managers asking me to touch the mouse again and again. I wanted a task manager that could fit in hacker workflow. So I created wq.

##How it works ?
wq is an entirely JavaScript app. It lives in browser. It is built on angularjs. It uses localStorage as persistence layer for storing your tasks. That means **when you clear browser data, tasks will be gone**

##How to use it ?
Just head over to http://chinmaymk.github.io/wq and start using it. No logins, no signups. wq allows you to create swimlanes and tasks, you can create swimlanes to maintain state or to maintain different lists. Each task belongs to a swimlane. 

##Supported commands

####ns - Creates a new swimlane
```javascript
ns [,swimlane name]
```

####nt - Creates a new task
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

####clean - Clear entire storage, this will delete EVERYTHING!
```javascript
clean
```

####What's swimlaneid and taskid ?
Each task and swimlane will be given an ID by default. In the picture above you should see 0.learn wq => 0 is the swimlaneid in this case. And taskid is nothing but the number present in front of task.

####What's {taskid expression} ?
To make things easy, you can do batch operations using some commands. you can do following instead of taskid
```javascript
dn 0 1-5 // toggles tasks from #1 to #5 in swimlane #0
dn 0 1,2,5 // toggles tasks from #1,#2, #5 in swimlane #0
```
**Don't forget to press return after you've entered these commands!**

##License
wq is published under MIT license.

##Got suggestions ?
Feel free to submit a pull request, file an issue, or get in touch on twitter [@_chinmaymk](https://twitter.com/_chinmaymk)

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/chinmaymk/wq/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

