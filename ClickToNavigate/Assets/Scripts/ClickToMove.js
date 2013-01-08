#pragma strict

/*
Click To Move script
	Moves the object towards the mouse position on left mouse click
*/

var smooth:int; // Determines how quickly object moves towards position
var playerSpeed : int = 4; // maximum distance it can move in one "turn"
var playerOriginalPosition: Vector3; // where player was originally located
var hit : RaycastHit; // returns the object clicked on
static var it : String = "Player"; // game begins with Player being "it"

// static variables are global ====================================================================================
static var allowMovement : boolean = true;
static var moved : boolean = false; // tracks if the player has moved this turn or not


private var targetPosition:Vector3;
private var preserveY: int; // var to hold capsule Y value so it doesn't "fall" through the plane due to its center being centered in the capsule, not its "feet"

function start () {
	preserveY = transform.position.y;	// keep the original y value for the player so he only moves around, not up/down
	targetPosition = transform.position; // init targetPosition to the current location
}


function Update () {
	// if its NOT the player's turn, don't allow them to move around
	if (!allowMovement) {
		// make sure the MoveIndicator is disabled/hidden
		ToggleGameObject(GameObject.Find("MoveIndicator"), false);
		return;
	}

/* commented out until I have time to fix it
	// if the TerminalLocation is visible, then move it appropriately
	if (GameObject.Find("MoveIndicator/TerminalLocation").renderer.enabled)
	{
		PointTheTerminalLocation();
	}
*/
	ManageMouseClicks();	
    
} // end function Update ()

/*
This function checks WHERE the user clicked. If they clicked appropriately, then it builds the new targetPosition and moves the player
*/
function ManageMouseClicks() {
    if(Input.GetKeyDown(KeyCode.Mouse0))
    {
    	// if they clicked on anything EXCEPT the ground, just get out
    	if(Physics.Raycast(Camera.main.ScreenPointToRay(Input.mousePosition), hit))
    	{
    		if (hit.transform.name != "Ground")
    			return;
		}
		else // else if they clicked on "nothing"
			return;
		
    	// if we have already moved this turn, then "bonk" and stop    	
		if (moved)
		{
			// play "bonk" sound so player knows action failed
			audio.Play();
			// drop out of function
			return;
		} //end if (moved)
		
//        var playerPlane = new Plane(transform.position, Vector3.up); // code sample I found
        var playerPlane = new Plane(transform.up, transform.position); // my "hack"
        var ray = Camera.main.ScreenPointToRay (Input.mousePosition);
        var hitdist : float;
        
        // if the click was somewhere other than the player capsule, look that direction
        var retval = playerPlane.Raycast (ray, hitdist);
        if (retval) {
            var targetPoint = ray.GetPoint(hitdist);
            targetPosition = ray.GetPoint(hitdist);
            var targetRotation = Quaternion.LookRotation(targetPoint - transform.position);
            transform.rotation = targetRotation;
        }
        moved = true;
		// make sure the MoveIndicator is disabled/hidden
		ToggleGameObject(GameObject.Find("MoveIndicator"), false);
        playerOriginalPosition = transform.position;
    }

    targetPosition.y = transform.position.y; // keep the y value. only x & z are changing

	// if they have not reached their max movement yet, allow them to continue
	if (Vector3.Distance(transform.position, playerOriginalPosition) < playerSpeed)
	{
		// Lerp slowly moves us from transform.position to targetPosition
    	transform.position = Vector3.Lerp (transform.position, targetPosition, Time.deltaTime * smooth);
    }
} // end function ManageMouseClicks()



/*
This function hides/shows the movement indicators for the player - both the max circle, and the direct movement line
*/
static function ToggleGameObject(moveIndicator: GameObject, newVisibility: boolean) {
    // toggles the visibility of this gameobject and all it's children
    var renderers = moveIndicator.GetComponentsInChildren(Renderer, true);
    for (var r : Renderer in renderers) {
        r.enabled = newVisibility;
    }
} // end function ToggleVisibility(parent)









/*
This function points the TerminalLocation in the right direction and then sets its length appropriately
	It isn't working exactly right though, so it has been disabled for now so I can move on to other stuff.
*/
/*
function PointTheTerminalLocation() {

	var pointer : GameObject = GameObject.Find("MoveIndicator/TerminalLocation");
    var pointerPlane = new Plane(Vector3(0,2,0), pointer.transform.position);
    var ray = Camera.main.ScreenPointToRay (Input.mousePosition);
    var hitdist = 0.0;
	
    // if the click was somewhere other than the player capsule, look that direction
    if (pointerPlane.Raycast (ray, hitdist)) {
        var targetPoint = ray.GetPoint(hitdist);
        var targetRotation = Quaternion.LookRotation(targetPoint - pointer.transform.position);
        
        targetRotation.x = transform.position.x; // don't look up/down by only changing the y position
        targetRotation.z = transform.position.z; // don't look up/down by only changing the y position
        
        pointer.transform.rotation = targetRotation;
		transform.rotation = targetRotation; // make the player follow the cursor
		
        var lineRenderer : LineRenderer = pointer.GetComponent(LineRenderer);
        
        // get the "length" (z) of the new position
        var zLength = 4;
        // make the length max out at playerSpeed
        if (zLength > playerSpeed)
        	zLength = playerSpeed;
        lineRenderer.SetPosition(1, Vector3(pointer.transform.position.x,pointer.transform.position.y,pointer.transform.position.z+4)); // need a vector, not a point
    }
    
} // end function PointTheTerminalLocation()
*/

