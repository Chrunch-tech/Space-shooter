const ship = document.getElementById("ship");
const velocity = 10;
const min_value = 0;
const bullet_velocity = 50;
const enemy_velocity = 20
const yAxisLimit = 650;
const unit = "px";
const enemyShipPath = ["assets/pixel_ship_blue_small.png", "assets/pixel_ship_green_small.png", "assets/pixel_ship_red_small.png"];
const enemyLaserPath = ["assets/pixel_laser_blue.png", "assets/pixel_laser_green.png", "assets/pixel_laser_red.png"];
let enemyCount = 5;


function Player(event) {
	const k = event.keyCode;
	this.ship_position = ship.getBoundingClientRect();

	// Defining how to move the ship around the canvas.
    this.move = {
        updown: function () {
            let y = parseInt(getComputedStyle(ship).top);

            if (k == 38 && min_value < ship_position.y){
                y -= velocity;
            }else if (k == 40  && 566 > ship_position.y) {
                y += velocity;
            };
            return y;
        },

        leftright: function () {
            let x = parseInt(getComputedStyle(ship).left);

            if (k == 37 && min_value < ship_position.x){
                x -= velocity;
            }else if (k == 39 && 1278 > ship_position.x){
                x += velocity;
            };

            return x;
        }
    };

    // Defining how to fire the bullets from the ship.
    const fire_bullets = function(){
    	bullet_div = document.getElementById("main-ship-firing-state");

    	if (k === 32){  // If user press spacebar.
    		const bullet_img = document.createElement("img");
    		bullet_img.setAttribute("src", "assets/pixel_laser_yellow.png");
    		bullet_img.setAttribute("id", "Bullet");
    		bullet_div.appendChild(bullet_img);
    		bullet_div.style.left = (this.ship_position.x - 9) + unit;
    		bullet_div.style.top = (this.ship_position.y - 30) + unit;

    		// Adding the sense to move the bullet.
    		const move_bullet = function(){
    			const bulletPosY = parseInt(bullet_div.style.top); // Current position of bullet along the y axis.
    			bullet_div.style.top = (bulletPosY - bullet_velocity) + unit;
    			if (bulletPosY <= min_value){  // If Bullet position is less then or equal to zero.
    				clearInterval(time_interal);
    				const removeImg = function(){bullet_img.remove()};   // Removing the image.
    				const removeStyle = function(){bullet_div.removeAttribute("style")};  // Removing the style.
    				setTimeout(removeImg, 400);
    				setTimeout(removeStyle, 400)
    			};
    		};
    		const time_interal = setInterval(move_bullet, 0.5);
    	};
    };
 
	// Calling player ship properties.
	ship.style.top = (move.updown()) + unit;
	ship.style.left = (move.leftright()) + unit;
	fire_bullets();
};


function Enemy(){
	this.enemyShip = document.getElementById("enemy-ship-img");
	this.enemy_ship_position = enemyShip.getBoundingClientRect();
	const enemyShipImg = document.createElement("img");
	const randomPicks = Math.floor(Math.random() * enemyShipPath.length);
	

	// Adding enemy ships.
	const addEnemy = function(){
		if (enemyShip.childNodes.length !== enemyCount){
			const elementId = Math.floor(Math.random() * 1000);
			enemyShipImg.setAttribute("id", elementId);
			enemyShipImg.setAttribute('src', enemyShipPath[randomPicks]);
			enemyShip.appendChild(enemyShipImg);
		};
	};
	setInterval(addEnemy, 1);

	function follow_algorithem(currentPosition, enemyPosition){
		/* Taking the current position of the player and enemy will follow that
		:params currentPosition: Current postion of the player ship
		:return: positon of enemy along the x-axis.
		*/
		if (enemyPosition != currentPosition){
			if (enemyPosition < currentPosition){
				enemyShip.style.left = (enemyPosition + (velocity * 2)) + unit;
			};
			if (enemyPosition > currentPosition){
				enemyShip.style.left = (enemyPosition - (velocity * 2)) + unit;
			};
		};
	};

	// Adding the ablity to move the ship along the y-axis.
	enemyShip.style.top =  (this.enemy_ship_position.y + enemy_velocity) + unit;
	// Setting random position of the enemy ship on the canvas.
	let playerShipPos = ship.getBoundingClientRect().x;
	follow_algorithem(playerShipPos, this.enemy_ship_position.x);

	if  (this.enemy_ship_position.y >= yAxisLimit){
		const removeEnemyImg = function(){enemyShipImg.remove()};
		const removeEnemyStyle = function(){enemyShip.removeAttribute("style")};
		setTimeout(removeEnemyImg, 100);
		setTimeout(removeEnemyStyle, 100);
	};

	// Adding the ability to fire the bullet.	
	const enemy_bullet = function(){
		/* Adding and moving enemy bullets around the canvas */

		const enemyBullet = document.getElementById("enemy-ship-firing-state");
		const enemyBulletImg = document.createElement("img");

		if (enemyBullet.childNodes.length <= enemyShip.childNodes.length){
			enemyBulletImg.setAttribute("src", enemyLaserPath[randomPicks]);
			enemyBullet.appendChild(enemyBulletImg);
		};

		// Positioning the bullet
		enemyBullet.style.left =  (this.enemy_ship_position.x - 10) + unit;
		enemyBullet.style.top =  (this.enemy_ship_position.y - 10) + unit;

		// Now, adding the sense for move the enemy bullet.
		const moveEnemyBullet = function(){
			const enemyBulletPosition = enemyBullet.getBoundingClientRect().y;  // Take the bullet position along the y-axis.
			if (enemyBulletPosition <= yAxisLimit){
				enemyBullet.style.top = (enemyBulletPosition + bullet_velocity) + unit;
			}
			else{  // If Bullet position is less then or equal to zero.
				const removeImg = function(){enemyBulletImg.remove()};   // Removing the image.
				const removeStyle = function(){enemyBullet.removeAttribute("style")};  // Removing the style.
				setTimeout(removeImg, 400);
				setTimeout(removeStyle, 400);
			};
		};
		// Moving enemy bullet.
		moveEnemyBullet();
	};
};


function collisionDetect(bulletPos, parentNode, parentNodePos, bulletNode, shipPos){
	/* Determining the collision based on a algorethem.
	:Algorithem: This algorithem is probaly based on box bonding plus my personal algorithem.
	:params bulletPos: coordinates of bullet.
	:params parentNode: enemyDiv by id.
	:params parentNodePos: coordinates of enenyDiv.
	:params bulletNode: bulletDiv by id 
	:return: childNode  if collision detected
	:return: null if collision is not detected
	*/
	// Intializing some constant variables.

	const low_value_x = Math.round(parentNodePos.x - 10);  // Subtracting 10px so that it'll point perfectly a the top left side of the div.
	const high_value_x = Math.round(low_value_x + parentNode.offsetWidth);
	const coordinate_y = Math.round(parentNodePos.y);
	const extentLimit = yAxisLimit;
	const difference = extentLimit - coordinate_y;
	const partsWidth = Math.round(parentNode.offsetWidth / enemyCount);
	const partsCount = Math.round(difference / parentNode.offsetHeight);
	const averageDistance_x = Math.round(parentNode.offsetWidth / enemyCount);
	const averageDistance_y = parentNode.offsetHeight;
	

	// Checking for collision.
	if (shipPos.x < low_value_x || shipPos.x > high_value_x){
		return null;
	}else{
		// Determining the box in which the ship is in.
		const shipInBoxCoor_x = Math.round(shipPos.x - parentNodePos.x);
		const shipInBoxCoor_y = Math.round(bulletPos.y - parentNodePos.y);
		let boxCount_x = 0;
		let box_position_x = 0;
		let boxCount_y = 0;
        let box_position_y = 0;


		// For determining the box along the x-axis.
		for (let x = 0; x <= enemyCount; x++){
			boxCount_x += 1;
			box_position_x += averageDistance_x;
			if (shipInBoxCoor_x <= box_position_x){
				break;
			};
		};
		// For determining the box along the y-axis.
		if (bulletPos.y <= 0){
			for (let y = 0; y <= partsCount; y++){
				boxCount_y = boxCount_y + 1;
				box_position_y += averageDistance_y;
				if (shipInBoxCoor_y <= box_position_y){
					break;
				};
			};
		};
		if (boxCount_y === 1){  // Collision is detected.
			if (shipInBoxCoor_x <= 5){
				boxCount_x = 0;
			};
			return boxCount_x;
		};
	};
};

function Events(){
	/* Defining several event that could happen in the game
	according to that this function update several values and
	data in the game 
	*/
	this.collision = function(){
		const enemy = new Enemy();
		const shipBullet = document.getElementById("main-ship-firing-state");
		const enemyShipBullet = document.getElementById("enemy-ship-firing-state");
		const shipBulletPos = shipBullet.getBoundingClientRect();
		const player_ship_pos = ship.getBoundingClientRect();

		// Checking for the collision of shipBullet to enemyShip.
		const isCollision = collisionDetect(shipBulletPos, enemy.enemyShip, enemy.enemy_ship_position, shipBullet, player_ship_pos);
		if (isCollision !== null && isCollision !== undefined){
			return isCollision;
		};
	};

	this.update = function(){
		/*This function is going to update the things in the canvas like:-
		- Power:
		- Enemy Count
        */
        const power = document.getElementById("Power");
        const enemyInDiv = document.getElementById('enemy-ship-img').childNodes;
        const playerBullet = document.getElementById('Bullet');

        // Start updating the things based on the collision.
        // debugger;
		if (getCollision !== null && getCollision !== undefined){
           let enemyId = enemyInDiv[getCollision].id;
           let enemy_ship_img = document.getElementById(enemyId);
           enemy_ship_img.remove();
           playerBullet.remove();
        };
	};

	const getCollision = collision();
	update();
};

window.addEventListener('keydown', function(){Player(event)}, false);
const waveInerval = setInterval(Enemy, 5);
setInterval(Events, 5);
//  To be continue;
