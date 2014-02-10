/**
 * Stupid angularjs doesn't block this event
 * @param  {[type]} e [description]
 * @return {[type]}   [description]
 */
$($(document).keydown(function(e) {
	if (e.which === 8) {
		//your custom action here
		return false;
	}
}));

/**
 * Just one controller no need of fancy angular.module syntax
 * @param {object} $scope
 */
function MainController($scope, $parse) {
	$scope.swimlanes = []
	$scope.keySequence = '';
	$scope.err = '';
	var allCommands = [];
	var counter = 0;

	/**
	 * Restores state or creates new one
	 * @return {[type]} [description]
	 */
	function boot() {
		var lanes = window.localStorage.getItem('wq') || [];
		if (lanes.length !== 0) {
			$scope.swimlanes = JSON.parse(lanes);
		} else {
			$scope.swimlanes = [{
				"name": "learn wq - type following",
				"tasks": [{
					"name": "nt 0 read comments",
					"important": ""
				}, {
					"name": "dn 0 1",
					"important": ""
				}, {
					"name": "delt 0 2",
					"important": ""
				}, {
					"name": "help",
					"important": ""
				}, {
					"name": "like what you see ? head over to gihub for more!",
					"important": ""
				}]
			}];
			$scope.help = true;
		}
	}

	/**
	 * Main command map, delegates responsibilities to respective functions
	 * @type {Object}
	 */
	var commandMap = {
		'ns': newSwimlane,
		'nt': newTask,
		'dn': toggleTask,
		'mv': moveTasks,
		'delt': deleteTask,
		'dels': deleteSwimlane,
		'eds': editSwimlane,
		'edt': editTask,
		'help': showHelp,
		'x': closeHelp,
		'clean': clean,
		'exp': 'exp'
	};

	function clean() {
		var result = confirm("This will delete everything, are you sure ?");
		if (result) {
			$scope.swimlanes = [];
		}
	}

	function showHelp() {
		$scope.help = true;
	}

	function closeHelp() {
		$scope.help = false;
	}

	function moveTasks(cmd) {
		var laneId = getSwimlaneId(cmd);
		var taskIdExp = cmd.args.shift();
		var targetLaneId = getSwimlaneId(cmd);

		parseTaskIdExpression(taskIdExp).forEach(function(d) {
			var task = $scope.swimlanes[laneId].tasks.splice(d, 1);
			$scope.swimlanes[targetLaneId].tasks.push(task[0]);
		})
	}

	/**
	 * changes the name of a swimlane
	 * @param  {[type]} cmd [description]
	 * @return {[type]}     [description]
	 */
	function editSwimlane(cmd) {
		var laneId = makeInt(cmd.args.shift());
		var name = cmd.args.join(" ") || promptForText("Give me a new name", $scope.swimlanes[laneId].name);
		$scope.swimlanes[laneId].name = name;
	}

	/**
	 * Edit a task
	 * @param  {object} cmd [description]
	 * @return {[type]}     [description]
	 */
	function editTask(cmd) {
		var laneId = makeInt(cmd.args.shift());
		var taskId = makeInt(cmd.args.shift());
		var name = cmd.args.join(" ") || promptForText("Give me a new name", $scope.swimlanes[laneId].tasks[taskId].name);
		$scope.swimlanes[laneId].tasks[taskId].name = name;
	}

	/**
	 * Removes a task
	 * @param  {[type]} cmd [description]
	 * @return {[type]}     [description]
	 */
	function deleteTask(cmd) {
		var laneId = makeInt(cmd.args.shift());
		var taskId = makeInt(cmd.args.shift());
		$scope.swimlanes[laneId].tasks.splice(taskId, 1);
	}

	/**
	 * toggles the state of task from done to normal
	 * @param  {[type]} cmd [description]
	 * @return {[type]}     [description]
	 */
	function toggleTask(cmd) {
		var laneId = getSwimlaneId(cmd);
		var taskIdExp = cmd.args.shift();
		parseTaskIdExpression(taskIdExp).forEach(function(d) {
			$scope.swimlanes[laneId].tasks[d].state = $scope.swimlanes[laneId].tasks[d].state === 'done' ? '' : 'done';
		})
	}

	/**
	 * Add a new swimlane
	 * @param  {object} cmd
	 * @return {[type]}     [description]
	 */
	function newSwimlane(cmd) {
		var name = cmd.args.join(" ") || promptForText("Give your new swimlane a name", "work");
		$scope.swimlanes.push({
			name: name,
			tasks: []
		});
	}

	/**
	 * Creates a new task
	 * @param  {object}  cmd         [description]
	 * @param  {Boolean} isImportant [description]
	 * @return {[type]}              [description]
	 */
	function newTask(cmd) {
		var laneId = getSwimlaneId(cmd);
		var name = cmd.args.join(" ") || promptForText("So you wanna add a task ?", "this is so awesome");
		$scope.swimlanes[laneId].tasks.push({
			name: name,
			important: cmd.args.indexOf("-i") != -1 ? 'important' : ''
		});
	}

	/**
	 * deletes a swimlane
	 * @param  {[type]} id [description]
	 * @return {[type]}    [description]
	 */
	function deleteSwimlane(cmd) {
		var id = makeInt(cmd.args.shift());
		$scope.swimlanes = $scope.swimlanes.splice(id, 1);
	}

	/**
	 * Primary interface for keypress event throughout the window
	 * @param  {[type]} ev [description]
	 * @return {[type]}    [description]
	 */
	$scope.keyPressed = function(ev) {

		switch (ev.which) {
			case 8: //if backspace
				$scope.keySequence = $scope.keySequence.substring(0, $scope.keySequence.length - 1)
				return;

			case 27: //if esc clear sequence
				$scope.keySequence = '';
				return;

			case 38: //Up arrow
				$scope.keySequence = allCommands[counter++ % allCommands.length];
				return

			case 40: //Down arrow
				$scope.keySequence = allCommands[--counter % allCommands.length];
				return

			case 13: //its enter, time to execute stuff
				executeCommand();
				allCommands.push($scope.keySequence);
				$scope.keySequence = '';
				return;

			case 37: //left 
			case 39: //right keys, return by default
				return;
		}
		//not any of above ? needs to added as sequence
		$scope.keySequence += getCharacter(ev);
		//clear previous errors if any;
		$scope.err = '';
	}

	function getCharacter(ev) {
		if (ev.which === 188) return ",";
		if (ev.which === 189) return "-";
		return String.fromCharCode(ev.keyCode || ev.which).toLowerCase();
	}

	/**
	 * Main magic
	 * @return {[type]} [description]
	 */
	function executeCommand() {
		var cmdObj = parseCommand();
		if (commandMap[cmdObj.cmd]) {
			try {
				commandMap[cmdObj.cmd](cmdObj);
			} catch (e) {
				$scope.err = e.message;
				throw e;
			}
		} else {
			$scope.err = "No such commnad " + $scope.keySequence;
		}
	}

	/**
	 * extracts commands and arguments from input string
	 * @return {[type]} [description]
	 */
	function parseCommand() {
		var commands = $scope.keySequence.trim().split(" ");
		return {
			cmd: commands.shift(),
			args: commands.map(function(d) {
				return d.trim();
			})
		};
	}

	/**
	 * Helper function for string to int conversion
	 * @param  {string} number [description]
	 * @return {[type]}        [description]
	 */
	function makeInt(number) {
		if (isNaN(parseInt(number, 10))) {
			throw new Error("invalid number entered");
		}
		return parseInt(number, 10);
	}

	function getSwimlaneId(cmd) {
		var laneId = makeInt(cmd.args.shift());
		return laneId;
	}

	function promptForText(title, defaultVal) {
		var name = prompt(title, defaultVal);
		if (!name) {
			throw new Error("Nah, empty string won't work, try again")
		}
		return name;
	}

	/**
	 * converts 1,2,3 and 1-3 to [1 2 3]
	 * Don't change the sequence, its crucial
	 * @param  {[type]} exp [description]
	 * @return {[type]}     [description]
	 */
	function parseTaskIdExpression(exp) {
		var taskIds = [];
		var sep = '';
		//comma seperated values
		if (exp.indexOf(",") !== -1) {
			sep = ',';
		}

		//range expression
		if (exp.indexOf("-") !== -1) {
			if (exp.split("-").length !== 2) {
				throw new Error("invalid range expression");
			}
			var temp = [];
			for (var i = makeInt(exp.split("-")[0]); i <= makeInt(exp.split("-")[1]); i++) {
				temp.push(i);
			};
			exp = temp.join(",");
			sep = ',';
		}

		exp.split(sep).forEach(function(d) {
			taskIds.push(makeInt(d));
		});
		return taskIds;
	}

	//save immedietly as the object changes
	$scope.$watch('swimlanes', function() {
		window.localStorage.setItem('wq', angular.toJson($scope.swimlanes));
	}, true);

	//load old things
	boot();
}
