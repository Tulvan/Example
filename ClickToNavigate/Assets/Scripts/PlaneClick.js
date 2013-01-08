#pragma strict

internal var mouseLeftButton : int = 0;
internal var mouseRightButton : int = 1;
internal var mouseWheel : int = 2;

var player : GameObject; // set to be the "player" capsule
var inMotion: boolean = false;
var someObject : GameObject; // "clicked" point, represented by a sphere sphere

var hit : RaycastHit; // returns the object clicked on

static var planeMinX : float;
static var planeMaxX : float;
static var planeMinZ : float;
static var planeMaxZ : float;

function Start () {
	// need the bounds of the plane to "coral" the monsters
	planeMinX = transform.renderer.bounds.min.x;
	planeMaxX = transform.renderer.bounds.max.x;
	planeMinZ = transform.renderer.bounds.min.z;
	planeMaxZ = transform.renderer.bounds.max.z;
}

function Update () {
	// on mouse down...
	if(Input.GetMouseButtonDown(mouseRightButton))
	{
		// if SOMETHING was clicked on....
    	if(Physics.Raycast(Camera.main.ScreenPointToRay(Input.mousePosition), hit))
    	{
Debug.Log("transform is currently the " + transform.name);
		    // this creates a horizontal plane passing through this object's center
		    var plane = Plane(transform.position, Vector3.up);
		    // create a ray from the mousePosition
		    var ray = Camera.main.ScreenPointToRay(Input.mousePosition);
		    // plane.Raycast returns the distance from the ray start to the hit point
		    var distance: float;
//		    if (plane.Raycast(ray, distance)){
		    plane.Raycast(ray, distance);
		        // some point of the plane was hit - get its coordinates
		        var hitPoint = ray.GetPoint(distance);
		        // use the hitPoint to aim your cannon
				Debug.Log("Hit " + hit.transform.name + " at " + distance + ", location " + hitPoint.x + "," + hitPoint.y + "," + hitPoint.z);
//			}
//			else
//				Debug.Log("Missed the plane?");
    	}
	}
}


/*
        var playerPlane = new Plane(Vector3(0,2,0), transform.position);
        var ray = Camera.main.ScreenPointToRay (Input.mousePosition);
        var hitdist = 0.0;
        
        // if the click was somewhere other than the player capsule, look that direction
        if (playerPlane.Raycast (ray, hitdist)) {
            var targetPoint = ray.GetPoint(hitdist);
            targetPosition = ray.GetPoint(hitdist);
*/