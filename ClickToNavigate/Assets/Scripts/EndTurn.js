#pragma strict

/* Button Content examples */

var icon : Texture2D; // need to put a buttton in this var
var activePlayer: String = "Player"; // either Player or Monster

static var monsterSpeed: int = 3; // max units a monster can move in 1 turn. accessed by SpawnMonster

var player : GameObject; // player construct
var monster : GameObject; // monster construct
var monsterOriginalPosition: Vector3;
var monsterTurnLength: int; //  monster turn length in seconds
var monsterTurnStartTime : float; // Time.time when monster turn started

// runs every frame
function OnGUI () {
	// Rect(x,y, w,h)
	if (GUI.Button (Rect (10,10, 100, 50), icon)) {
		if (activePlayer == "Player")
		{
			activePlayer = "Monster";
			monsterTurnStartTime = Time.time;
		}
		else
		{
			activePlayer = "Player";
			// enable the user controls during their turn
			ClickToMove.allowMovement = true;
		}
		// set their colors appropriately
		SetActiveUnit(activePlayer);
	} // end if (GUI.Button (Rect (10,10, 100, 50), icon))

	GUI.Label (Rect ( parseInt(Screen.width/2)-100,0,200,50), "Currently turning: " + activePlayer);
	
	if (activePlayer == "Monster")
	{
		// call a separate function so it can "wait" - this one can't wait
		var aryMonsters = GameObject.FindGameObjectsWithTag ("Monster");
		for (monster in aryMonsters)
		{
			MonsterTurn(monster);
		}
	}
	
//	Debug.Log(Time.time + " vs " + Time.realtimeSinceStartup + " activePlayer: " + activePlayer + ", allowMovement: " + ClickToMove.allowMovement + ", moved: " + ClickToMove.moved + ", monsterTurnCount: " + monsterTurnCount);
} // end function OnGUI



function MonsterTurn (monster: GameObject) {
	// make the monster look at the player
//	monster = GameObject.Find("Monster");
	player = GameObject.Find("Player");

	// init mOP if its null	
	if (monsterOriginalPosition == Vector3())
	{
		// have to capture values separately, otherwise mOP BECOMES monster.transform
		monsterOriginalPosition = monster.transform.position;
	}
/*
	// if the monster has already moved his speed, give the user control back	
	if (Vector3.Distance(monster.transform.position, monsterOriginalPosition) >= monsterSpeed)
	{
		EndMonsterTurn(monster);
		return;
	}
*/	
    // make the monster look at/away from the player, but DON'T go up/down  
    if (ClickToMove.it == "Player")      
	    monster.transform.rotation = Quaternion.LookRotation(monster.transform.position - player.transform.position); // reverse LookAt
	else
	    monster.transform.LookAt(new Vector3(player.transform.position.x, monster.transform.position.y, player.transform.position.z));

    // if the new monster location would leave the plane, just stop
    var newPosition = monster.transform.position+monster.transform.forward;
/*
    if (newPosition.x < PlaneClick.planeMinX)
    	newPosition.x = PlaneClick.planeMinX;
    if (newPosition.z < PlaneClick.planeMinZ)
    	newPosition.z = PlaneClick.planeMinZ;
    if (newPosition.x > PlaneClick.planeMaxX)
    	newPosition.x = PlaneClick.planeMaxX;
    if (newPosition.z > PlaneClick.planeMaxZ)
    	newPosition.z = PlaneClick.planeMaxZ;
*/    	
	// move him forward a bit each cycle
	monster.transform.position = Vector3.Lerp (monster.transform.position, newPosition, Time.deltaTime * .5);

	// disable the user controls during monster turn
	ClickToMove.allowMovement = false;
	
	// end the monster turn after his turn length expires	
	if (Time.time > (monsterTurnStartTime + monsterTurnLength) )  {
		EndMonsterTurn(monster);
	}
} // end function MonsterTurn



function EndMonsterTurn (monster: GameObject) {
	// save the monster location for the next turn
	monsterOriginalPosition = monster.transform.position;
	// set activePlayer back to the user
	activePlayer = "Player";
	// set their colors appropriately
	SetActiveUnit(activePlayer);
	// allow them to move again
	ClickToMove.allowMovement = true;
	// declare they have not moved yet this turn
	ClickToMove.moved = false;
	// show the player movement range again
	ClickToMove.ToggleGameObject(GameObject.Find("MoveIndicator"), true);
}

/*
This function makes the active unit red and all other units green.
	There are only 2 units: Player & Monster.
*/
function SetActiveUnit(activeUnit: String) {
/* old - not using this any more
	if (activeUnit == "Player") {
		ColorUnit("Player", "Red");
		ColorUnit("Monster", "Green");
	}
	else {
		ColorUnit("Player", "Green");
		ColorUnit("Monster", "Red");
	}
*/
} // end function SetActiveUnit(activeUnit: String)

/*
Change the parent and all children's materials to the selected color
*/
function ColorUnit(gameUnit: GameObject, materialToUse: String) {
	var tmpMaterial : Material = Resources.Load("Textures/Materials/" + materialToUse) as Material;
	
	gameUnit.renderer.material = tmpMaterial;
	
	var aryBodyPieces : GameObject[] = GetChildGameObjectsByTag(gameUnit, "Body");
	for(var bodyPiece: GameObject in aryBodyPieces)
	{
		// array contains null values, so skip them
		if (bodyPiece)
			bodyPiece.renderer.material = tmpMaterial;
	}
}

/*
This function checks theParent for child GameObjects with theTag and returns an array of GameObjects
*/
function GetChildGameObjectsByTag(theParent : GameObject, theTag  : String) : GameObject[]{
	var tempTransforms = theParent.GetComponentsInChildren(Transform, true);
	
	var children: GameObject[] = new GameObject[tempTransforms.length-1];
	
	for(var i=0; i < tempTransforms.length-1; i++){
	if (tempTransforms[i+1].gameObject.tag == theTag)
	    children[i] = tempTransforms[i+1].gameObject;
	}
	
	// clean up the array by removing any null values
	
	return children;
}

/*
Function to calculate the closest monster to the gameobject
*/
function FindClosestMonster () : GameObject {
    // Find all game objects with tag Enemy
    var gos : GameObject[];
    gos = GameObject.FindGameObjectsWithTag("Monster"); 
    var closest : GameObject; 
    var distance = Mathf.Infinity; 
    var position = transform.position; 
    // Iterate through them and find the closest one
    for (var go : GameObject in gos)  { 
        var diff = (go.transform.position - position);
        var curDistance = diff.sqrMagnitude; 
        if (curDistance < distance) { 
            closest = go; 
            distance = curDistance; 
        } 
    } 
    return closest;    
} // end function FindClosestMonster () : GameObject