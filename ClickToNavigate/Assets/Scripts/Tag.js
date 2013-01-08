#pragma strict

function Start () {

}

function Update () {

}

/*
When whoever is "it" triggers someone else, stop moving immediately
*/

function OnTriggerEnter(collision: Collider) {
	/* the triggerER must be Player or Monster, and the triggerEE must also be player or monster
		The triggerER is the object the script is attached to, so that is covered. The triggerEE
		has to be monitored here
	*/
	if (! (collision.gameObject.transform.name == "Player" || collision.gameObject.transform.name == "Monster") )
		return;
		
	if (transform.name == "Player" && ClickToMove.it == "Player" && collision.gameObject.transform.name == "Monster")
	{
		// make the Player green and the monster red
		ColorUnit(transform.gameObject, "Green");
		ColorUnit(collision.gameObject, "Red");
		ClickToMove.it = "Monster";
	}
	else if (transform.name == "Monster" && ClickToMove.it == "Monster" && collision.gameObject.transform.name == "Player")
	{
		// make the monster green and the player red
		ColorUnit(transform.gameObject, "Green");
		ColorUnit(collision.gameObject, "Red");
		ClickToMove.it = "Player";
	}
} // end function OnTriggerEnter(collision: Collider)

/*
Change the parent and all children's materials to the selected color.
	TODO: This function is also in EndTurn. How can I make universal functions?
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
} // end function ColorUnit(gameUnit: GameObject, materialToUse: String)

/*
This function checks theParent for child GameObjects with theTag and returns an array of GameObjects
	TODO: This function is also in EndTurn. How can I make universal functions?
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
