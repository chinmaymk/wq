
/**
 * Stupid angular doesn't block this event
 * @param  {[type]} e [description]
 * @return {[type]}   [description]
 */
$($(document).keydown(function (e) {
  if (e.which === 8) {
    //your custom action here
    return false;
  }
}));

function MainController($scope) {
	$scope.swimlanes = window.localStorage.getItem('wq') || [];
	if($scope.swimlanes.length !== 0) {
		$scope.swimlanes = JSON.parse($scope.swimlanes);
	}
	$scope.keySequence = '';
	var laneSelected = false;
	var taskSelected = false;

	$scope.addSwimlane = function () {

		var name = prompt("Give your new swimlane a name", "work");
		if(!name) {
			alert("Nah, empty string won't work, try again");
			return;
		}

		var newLane = {
			name : name,
			tasks : []
		}
		 
		//Beat this :D
		if(!!!getSwimlane($scope.swimlaneName)) {
			$scope.swimlanes.push(newLane);
		}
	}

	$scope.addTask = function() {
		if(!laneSelected) {
			alert('select a swimlane to add task');
			return;
		}

		var name = prompt("So you wanna add a task ?", "this is so awesome");
		if(!name) {
			alert("Nah, empty string won't work, try again");
			return;
		}

		var lane = getSelectedLane();
		lane.tasks.push({name: name});
	}

	function getSelectedLane() {
		return $scope.swimlanes.filter(function(d) {
			return d.selected;
		})[0]
	}

	function getSwimlane(name) {
		return $scope.swimlanes.filter(function(d){
			d.name === name;
		})[0];
	}

	$scope.removeSwimlane = function () {
		var self = this;
		$scope.swimlanes = $scope.swimlanes.filter(function(d) {
			return d.name !== self.lane.name;
		});
	}

	$scope.keyPressed = function(ev) {
		//if backspace
		if(ev.which === 8) {
			$scope.keySequence = $scope.keySequence.substring(0, $scope.keySequence.length - 1)
			return;
		}
		//if esc clear sequence
		if(ev.which === 27) {
			$scope.keySequence = '';
			return;
		}
		//its enter, terminate the sequence
		if(ev.which === 13) {
			handleKeyPress();
			$scope.keySequence = '';	
			return
		}
		// else form a number to parse
		$scope.keySequence += String.fromCharCode(ev.which).toLowerCase();
		console.log(ev.which, $scope.keySequence);
	}

	function handleKeyPress() {
		switch($scope.keySequence.toLowerCase()) {
			case 'ns' : 
				$scope.addSwimlane()
				return;
				break;

			case 'nt' : 
				$scope.addTask();
				return;
				break;

			case 'cls' : 
				laneSelected = false;
				taskSelected = false;
				$scope.swimlanes.forEach(function(d) {
					d.selected = false;
					d.tasks.forEach(function(e) {
						e.state = '';
					});
				});
				return;
				break;

			default: 
				console.log('no implementation for', $scope.keySequence);
				break;
		}

		var number = parseInt($scope.keySequence, 10);
		console.log(number);

		if(!!number && !laneSelected && (number - 1 < $scope.swimlanes.length)) {
			var number = parseInt($scope.keySequence, 10);
			laneSelected = true;
			$scope.swimlanes[number - 1].selected = true;
		} else if(!!number && laneSelected && (number - 1 < getSelectedLane().tasks.length)) {
				getSelectedLane().tasks[number - 1].state = 'selected';
		}

		return false;
	}

	$scope.$watch('swimlanes', function() {
		window.localStorage.setItem('wq', JSON.stringify($scope.swimlanes));
	}, true)
}