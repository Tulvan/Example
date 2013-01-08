#pragma strict

var icon : Texture2D; // need to put a buttton in this var
var monsterPrefab : Transform;

// runs every frame
function OnGUI () {
	// Rect(x,y, w,h) when the button is clicked, spawn another monster
	if (GUI.Button (Rect (Screen.width-110,10, 100, 50), icon)) {
	
		var player = GameObject.Find("Player"); // get a reference to the player
		
		// spawn the monster somewhere near the player
		var randX : float = Random.Range(EndTurn.monsterSpeed*-1,EndTurn.monsterSpeed);
		var randZ : float = Random.Range(EndTurn.monsterSpeed*-1,EndTurn.monsterSpeed);
		var monsterVector : Vector3 = Vector3(player.transform.position.x+randX, player.transform.position.y, player.transform.position.z + randZ);
		
		// Quaternion.identity is basically saying no rotation
		var monster = Instantiate(monsterPrefab, monsterVector, Quaternion.identity);
		monster.transform.name = "Monster";
	} // end if (GUI.Button (Rect (10,10, 100, 50), icon))

} // end function OnGUI


function Start () {

}

function Update () {

}