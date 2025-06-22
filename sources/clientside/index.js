/*mp.events._callRemote = mp.events.callRemote;

mp.events.callRemote = (eventName, ...handler) => {
	mp.events._callRemote(eventName, ...handler);
	mp.events._callRemote("event_stats", eventName);
};
*/

//global.rpc = require('./utils/rage-rpc.min.js');


require('./lang/index')
require('./debug/index')

global.soundApi = {};
global.chatActive = false;
global.loggedin = false;
global.localplayer = mp.players.local;
global.localplayer.freezePosition(false);

let antiFloodCahce = {};
global.antiFlood = (name, time) => {
	const now = Date.now();

	if (antiFloodCahce[name] > now)
		return false;

	antiFloodCahce[name] = now + time;

	return true;
}

global.RAYCASTING_FLAGS = { map: 1, vehicles: 2, players: 4, players2: 8, objects: 16, vegetation: 256 };

global.Natives = {};

// Обычные нативные функции (invoke)
const nativeInvoke = {
	ADD_TEXT_ENTRY: '0x32CA01C3',
	RELEASE_SCRIPT_GUID_FROM_ENTITY: '0x2B3334BCA57CD799',
	ADD_BLIP_FOR_ENTITY: '0x5CDE92C702A8FCE7',
	REMOVE_BLIP: '0x86A652570E5F25DD',
	SET_BLIP_CATEGORY: '0x234CDD44D996FD9A',
	SHOW_HEADING_INDICATOR_ON_BLIP: '0x5FBCA48327B914DF',
	SET_BLIP_COLOUR: '0x03D7FB09E75D6B7E',
	SET_BLIP_AS_FRIENDLY: '0x6F6F290102C02AB4',
	SET_BLIP_SPRITE: '0xDF735600A4696DAF',
	SET_THIS_SCRIPT_CAN_REMOVE_BLIPS_CREATED_BY_ANY_SCRIPT: '0xB98236CAAECEF897',
	GET_NUMBER_OF_ACTIVE_BLIPS: '0x9A3FF3DE163034E8',
	IS_WAYPOINT_ACTIVE: '0x1DD1F58F493F1DA5',
	_DELETE_WAYPOINT: '0xD8E694757BCEA8E9',
	GET_WAYPOINT_BLIP_ENUM_ID: '0x186E5D252FA50E7D',
	GET_FIRST_BLIP_INFO_ID: '0x1BEDE233E6CD2A1F',
	GET_NEXT_BLIP_INFO_ID: '0x14F96AA50D6FBEA7',
	DOES_BLIP_EXIST: '0xA6DB27D19ECBB7DA',
	GET_BLIP_INFO_ID_TYPE: '0xBE9B0959FFD0779B',
	GET_BLIP_SPRITE: '0x1FC877464A04FC4F',
	ANIMPOSTFX_STOP_ALL: '0xB4EDDC19532BFB85',
	GET_SOUND_ID: '0x430386FE9BF80B45',
	DOES_ENTITY_EXIST: '0x7239B21A38F536BA',
	SET_ENTITY_LOD_DIST: '0x5927F96A78577363',
	ACTIVATE_PHYSICS: '0x710311ADF0E20730',
	SET_DAMPING: '0xEEA3B200A6FEB65B',
	SET_ENTITY_VELOCITY: '0x1C99BB7B6E96D16F',
	SET_ENTITY_INVINCIBLE: '0x3882114BDE571AD4',
	SET_ENTITY_PROOFS: '0xFAEE099C6F890BB8',
	ATTACH_ENTITY_TO_ENTITY: '0x6B9BBD38AB0796DF',
	FREEZE_ENTITY_POSITION: '0x428CA6DBD1094446',
	GET_CLOCK_HOURS: '0x25223CA6B4D20B7F',
	GET_INTERIOR_FROM_ENTITY: '0x2107BA504071A6BB',
	SET_TV_CHANNEL_PLAYLIST: '0xF7B38B8305F1FE8B',
	SET_SCRIPT_GFX_DRAW_ORDER: '0x61BB1D9B3A95D802',
	SET_SCRIPT_GFX_DRAW_BEHIND_PAUSEMENU: '0xC6372ECD45D73BCD',
	_DRAW_INTERACTIVE_SPRITE: '0x2BC54A8188768488',
	REMOVE_PARTICLE_FX_FROM_ENTITY: '0xB8FEAEEBCC127425',
	IS_RADAR_HIDDEN: '0x157F93B036700462',
	HIDE_HUD_AND_RADAR_THIS_FRAME: '0x719FF505F097FD20',
	HIDE_MINIMAP_EXTERIOR_MAP_THIS_FRAME: '0x5FBAE526203990C9',
	_PLAY_AMBIENT_SPEECH1: '0x8E04FEDD28D42462',
	SET_TIMECYCLE_MODIFIER: '0x2C933ABF17A1DF41',
	SET_TIMECYCLE_MODIFIER_STRENGTH: '0x82E7FFCD5B2326B3',
	CLEAR_TIMECYCLE_MODIFIER: '0x0F07E7745A236711',
	IS_VEHICLE_ATTACHED_TO_TRAILER: '0xE7CF3C4F9F489F0C',
	IS_ENTITY_ATTACHED_TO_ANY_VEHICLE: '0x26AA915AD89BFB4B',
	GET_VEHICLE_TRAILER_VEHICLE: '0x1CDD6BADC297830D',
	DETACH_VEHICLE_FROM_TRAILER: '0x90532EDF0D2BDD86',
	ATTACH_VEHICLE_TO_TRAILER: '0x3C7D42D58F770B54',
	GET_FRAME_COUNT: '0xFC8202EFC642E6F2',
	GET_GAME_TIMER: '0x9CD27B0045628463',
	SET_TRAIN_SPEED: '0xAA0BC91BE0B796E3',
	SET_TRAIN_CRUISE_SPEED: '0x16469284DB8C62B5',
	DELETE_ALL_TRAINS: '0x736A718577F39C7D',
	SET_MISSION_TRAIN_COORDS: '0x591CA673AA6AB736',
	SWITCH_TRAIN_TRACK: '0xFD813BB7DB977F20',
	SET_ENTITY_AS_MISSION_ENTITY: '0xAD738C3085FE7E11',
	SET_ENTITY_QUATERNION: '0x77B21BE7AC540F07',
	GET_PED_STEALTH_MOVEMENT: '0x7C2AC9CA66575FBF',
	DELETE_ENTITY: '0xAE3CBE5BF394C9C9',
	SET_ENTITY_COORDS_NO_OFFSET: '0x239A3351AC1DA385',
	DELETE_OBJECT: '0x539E0AE3E6634B9F',
	SET_PED_NEVER_LEAVES_GROUP: '0x3DBFC55D5C9BB447',
	SET_PED_AS_GROUP_MEMBER: '0x9F3480FE65DB31B5',
	GET_PLAYER_GROUP: '0x0D127585F77030AF',
	_GET_NUM_HAIR_COLORS: '0xE5C0CF872C2AD150',
	IS_ENTITY_AN_OBJECT: '0x8D68C8FD0FACA94E',
	GET_ENTITY_MODEL: '0x9F47B058362C84B5',
	ReplaceHudColourWithRgba: '0xF314CF4F0211894E'
};

// Генерация методов Natives, которые вызывают mp.game.invoke
for (const [name, hash] of Object.entries(nativeInvoke)) {
	Natives[name] = (...args) => mp.game.invoke(hash, ...args);
}

// Нативные функции, возвращающие Vector3 (invokeVector3)
const nativeVector3 = {
    GET_ENTITY_COORDS: '0x3FEF770D40960D5A',
    GET_ENTITY_ROTATION: '0xAFBD61CC738D9EB9',
    GET_OFFSET_FROM_ENTITY_GIVEN_WORLD_COORDS: '0x2274BC1C4885E333',
    GET_OFFSET_FROM_ENTITY_IN_WORLD_COORDS: '0x1899F328B0E12848'
}

// Генерация методов Natives, которые вызывают mp.game.invokeVector3
for (const [name, hash] of Object.entries(nativeVector3)) {
    Natives[name] = (...args) => mp.game.invokeVector3(hash, ...args);
}

// Нативные функции, возвращающие строку (invokeString)
const nativeString = {
    GET_VEHICLE_NUMBER_PLATE_TEXT: '0x7CE1CCB9B293020E',
    GET_MOD_TEXT_LABEL: '0x8935624F8C5592CC'
};

// Генерация методов Natives, которые вызывают mp.game.invokeString
for (const [name, hash] of Object.entries(nativeString)) {
    Natives[name] = (...args) => mp.game.invokeString(hash, ...args);
}

// Нативные функции, возвращающие число (invokeNumber)
Natives._GET_PED_HAIR_RGB_COLOR = (hairColorIndex, outR, outG, outB) => mp.game.invoke('0x4852FC386E2E1BB5', hairColorIndex, outR, outG, outB);
Natives._GET_NUM_MAKEUP_COLORS = () => mp.game.invoke('0xD1F7CA1535D22818');
Natives._GET_PED_MAKEUP_RGB_COLOR = (makeupColorIndex, outR, outG, outB) => mp.game.invoke('0x013E5CFC38CD5387', makeupColorIndex, outR, outG, outB);
Natives.TASK_GO_TO_ENTITY = (entity, target, duration, distance, speed, p5, p6) => mp.game.invoke('0x6A071245EB0D1882', entity, target, duration, distance, speed, p5, p6);

global.renderName = {
	"render": "cRender",
	"1s": "t.1s",
	"2s": "t.2s",
	"2.5ms": "t.2.5ms",
	"5s": "t.5s",
	"10s": "t.10s",
	"50ms": "t.50ms",
	"100ms": "t.100ms",
	"125ms": "t.125ms",
	"150ms": "t.150ms",
	"250ms": "t.250ms",
	"200ms": "t.200ms",
	"350ms": "t.350ms",
	"500ms": "t.500ms",
	"time": "t.time",
	"sound": "t.sound",
	"soundRot": "t.soundRot",
}

/*
const getObjectOffset = (position, heading, offset) => mp.game.object.getObjectOffsetFromCoords(
	position.x,
	position.y,
	position.z,
	heading,
	offset.x,
	offset.y,
	offset.z
);

const drawTexture3d = (position, textureDict, textureName, {scaleX = 1, scaleY = 1, heading = 0}) => {
	if (!mp.game.graphics.hasStreamedTextureDictLoaded(textureDict)) {
		mp.game.graphics.requestStreamedTextureDict(textureDict, true);

		return;
	}

	const pos1 = new mp.Vector3(-0.5 * scaleX, 0, 0.5 * scaleY);
	const pos2 = new mp.Vector3(0.5 * scaleX, 0, 0.5 * scaleY);
	const pos3 = new mp.Vector3(-0.5 * scaleX, 0, -0.5 * scaleY);
	const pos4 = new mp.Vector3(0.5 * scaleX, 0, -0.5 * scaleY);

	const finalPos1 = getObjectOffset(position, heading, pos1);
	const finalPos2 = getObjectOffset(position, heading, pos2);
	const finalPos3 = getObjectOffset(position, heading, pos3);
	const finalPos4 = getObjectOffset(position, heading, pos4);

	mp.game.invoke('0x29280002282F1928',
		finalPos1.x,
		finalPos1.y,
		finalPos1.z,

		finalPos3.x,
		finalPos3.y,
		finalPos3.z,

		finalPos2.x,
		finalPos2.y,
		finalPos2.z,

		255,
		255,
		255,
		255,

		textureDict,
		textureName,

		0.000000001,
		0.000000001,
		0.000000001,

		0.000000001,
		0.999999999,
		0.000000001,

		0.999999999,
		0.000000001,
		0.000000001,
	);

	mp.game.invoke('0x29280002282F1928',
		finalPos3.x,
		finalPos3.y,
		finalPos3.z,

		finalPos4.x,
		finalPos4.y,
		finalPos4.z,

		finalPos2.x,
		finalPos2.y,
		finalPos2.z,

		255,
		255,
		255,
		255,

		textureDict,
		textureName,

		0.000000001,
		0.999999999,
		0.000000001,

		0.999999999,
		0.999999999,
		0.000000001,

		0.999999999,
		0.000000001,
		0.000000001,
	);
};*/

global.wait = time => new Promise(resolve => setTimeout(resolve, time));

global.passports = [];
global.friends = [];

global.binderFunctions = [];

global.pAdmin = 0;

require('./configs/natives.js');
require('./utils/cef.js');
require('./constants/controls.js');
require('./constants/keys.js');
require('./camera/index.js');

require('./animation/index.js');

//require('./configs/barber.js');
//require('./configs/tattoo.js');

require('./utils/checkpoints.js');
require('./utils/nativeui.bundle.js');
require('./utils/other.js');
require('./utils/screeneffects.js');
require('./utils/utils.js');
require('./utils/validator.js');

require('./admin/esp.js');
require('./admin/markerteleport.js');
require('./admin/noclip.js');
require("./admin/spectate.js");
require("./admin/cinematiccamera.js");

require("./inventory/attachments.js");
require("./inventory/dropEditor.js");
require("./inventory/objectEditor.js");
require('./inventory/index.js');
require("./inventory/notes.js");
require("./inventory/test.js");

require('./player/afksystem.js');
require('./player/animation.js');
require('./player/atm.js');
require('./player/auth.js');
require('./player/bankmarket.js');
require('./player/basicsync.js');
require('./player/bind.js');
require('./player/bodysearch.js');
require('./player/binoculars.js');
require('./player/character.js');
require('./player/chat.js');
require('./player/circle.js');
require('./player/clubmenu.js');
require('./player/confirm.js');
require('./player/crosshair.js');
require('./player/death.js');
require('./player/dial.js');
require('./player/docs.js');
require('./player/donatemenu.js');
require('./player/fingerpointing.js');
require('./player/fractionguns.js');
require('./player/gamertag.js');
require('./player/gangzones.js');
require('./player/helpmenu.js');
require('./player/hud.js');
require('./player/input.js');
require('./player/jobselector.js');
require('./player/lift.js');
require('./player/menus.js');
require('./player/petshop.js');
require('./player/render.js');
require('./player/report.js');
require('./player/screen.js');
require('./player/simplemenu.js');
require('./player/sync.js');
require('./player/veh.js');
require('./player/voice.js');
require('./player/weapon.js');
require('./player/weaponcraft.js');
require('./player/weaponshop.js');
require('./player/npc_dialogs.js');
require('./player/mine_job.js');
require('./player/push_car.js');
require('./player/lumberjack.js');
require('./player/boombox.js');
require('./player/wedding.js');
require('./player/damage/index.js');
require('./player/chatHeadOverlay.js')
require('./business/businessmanage.js');
require('./vehicle/race_system.js');
require('./vehicle/autoshop.js');
require('./vehicle/control.js');
require('./vehicle/petrol.js');
require('./vehicle/radiosync.js');
require('./vehicle/vehiclesync.js');
require('./vehicle/rentcar.js');
require('./vehicle/drone.js');
require('./vehicle/flatbed.js');
require('./vehicle/ticket.js');
require('./vehicle/mileage.js');
require('./fractions/advert.js')
require('./fractions/policecomputer.js')
require('./fractions/stock.js');
require('./fractions/policepc.js');
require('./fractions/mats.js');
require('./fractions/menu.js');
require('./house/furniture.js');
require('./house/index.js');
require('./house/rieltagency.js');
require('./world/anim.js');
require('./world/doors.js');
require('./world/environment.js');
require('./world/ipls.js');
require('./world/other.js');
require('./world/sync.js');
require('./world/metro.js');
//require('./world/golf.js');
require('./world/stream.js');
//require('./world/metro/index.js');
require('./world/petSystem.js');
require('./world/livingcity.js');
require('./main.js');
require('./casino');
require('./synchronization/index.js');
require('./shop/weapon/weaponComponents.js');
require('./shop/clothes/clothesEditor.js');//+++
require('./shop/custom/index.js');
require('./synchronization/state.js');
require('./synchronization/particleFx.js');
require('./synchronization/sit.js');
require('./shop/newshop/index.js');
require('./events/eventsMenu.js');
require('./events/airdrop.js');
require('./events/heliCrash.js');
require('./events/festive.js');
require('./events/airsoft.js');
require('./events/award.js');
require('./events/mafia_game.js');
require('./events/tankRoyale.js');
require('./events/matwar.js');
require('./polygons/index.js');
require('./phone/index.js');
require('./battlepass/battlepass.js');
require('./table/index');
require('./shamancode/snake.js');
//require('./shamancode/suicide.js');
//npmrequire('./shamancode/compass.js');
//require('./shamancode/helicam.js');
require('./pritonCode/trafficWithoutSync/index.js');

gm.events.add('setFriendList', function (clear, friendlist) {
	try {
		if (clear) {
			global.friends = [];
		}

		for (let key in friendlist) {
			global.friends[key] = friendlist[key];
		}
	}
	catch (e) {
		mp.events.callRemote("client_trycatch", "index", "setFriendList", e.toString());
	}
})

gm.events.add('setFriend', function (friend, fullname) {
	try {
		global.friends[friend] = fullname;
	}
	catch (e) {
		mp.events.callRemote("client_trycatch", "index", "setFriend", e.toString());
	}
})

// // // // // // //
global.spectating = false;
global.sptarget = null;


var petathouse = null;
gm.events.add('petinhouse', (petName, petX, petY, petZ, petC, Dimension) => {
	try {
		if (petathouse != null) {
			petathouse.destroy();
			petathouse = null;
		}
		switch (petName) {
			case "Husky":
				petName = 1318032802;
				break;
			case "Poodle":
				petName = 1125994524;
				break;
			case "Pug":
				petName = 1832265812;
				break;
			case "Retriever":
				petName = 882848737;
				break;
			case "Rottweiler":
				petName = 2506301981;
				break;
			case "Shepherd":
				petName = 1126154828;
				break;
			case "Westy":
				petName = 2910340283;
				break;
			case "Cat":
				petName = 1462895032;
				break;
			case "Rabbit":
				petName = 3753204865;
				break;
		}
		petathouse = mp.peds.new(petName, new mp.Vector3(petX, petY, petZ), petC, Dimension);
	}
	catch (e) {
		mp.events.callRemote("client_trycatch", "index", "petinhouse", e.toString());
	}
});


const MeleeWeapon = [
	-1569615261,
	-1716189206,
	1737195953,
	1317494643,
	-1786099057,
	-2067956739,
	1141786504,
	-102323637,
	-1834847097,
	-102973651,
	-656458692,
	-581044007,
	-1951375401,
	-538741184,
	-1810795771,
	419712736,
	-853065399,
	940833800
]


gm.events.add("render", () => {
	if (!global.loggedin) return;
	mp.game.controls.disableControlAction(0, 48, true); // map Z control
	mp.game.controls.disableControlAction(2, 45, true); // reload control
	//localplayer.setCanSwitchWeapon(false);

	//     weapon switch controls       //
	mp.game.controls.disableControlAction(1, 243, true); // CCPanelDisable
});

const entityMap = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;',
	'/': '&#x2F;',
	'`': '&#x60;',
	'=': '&#x3D;'
};

global.escapeHtml = (str) => {
	return String(str).replace(/[&<>"'`=\/]/g, function (s) {
		return entityMap[s];
	});
}

global.loadModel = (requiredModel) => new Promise(async (resolve, reject) => {
	try {
		if (typeof requiredModel === "string")
			requiredModel = mp.game.joaat(requiredModel);
		if (mp.game.streaming.hasModelLoaded(requiredModel))
			return resolve(true);
		mp.game.streaming.requestModel(requiredModel);
		let d = 0;
		while (!mp.game.streaming.hasModelLoaded(requiredModel)) {
			if (d > 5000) return resolve(false);
			d++;
			await global.wait(0);
		}
		return resolve(true);
	}
	catch (e) {
		mp.events.callRemote("client_trycatch", "events/airdrop", "loadModel", e.toString());
		resolve(false);
	}
});

global.isAttached = (entity) => new Promise(async (resolve, reject) => {
	try {
		if (entity && entity.handle !== 0 && !!entity.isAttached())
			return resolve(true);
		let d = 0;
		while (!entity || !entity.handle !== 0 || !!!entity.isAttached()) {
			if (d > 500) return resolve(false);
			d++;
			await global.wait(10);
		}
		return resolve(true);
	}
	catch (e) {
		mp.events.callRemote("client_trycatch", "events/airdrop", "isAttached", e.toString());
		resolve(false);
	}
});

gm.events.add("setTraffic", (index) => {
	mp.game.streaming.setPedPopulationBudget(index);
});

gm.events.add("cleartraffic", () => {
	const position = global.localplayer.position;
	mp.game.gameplay.clearArea(position.x, position.y, position.z, 10000, true, false, true, false);
	mp.game.gameplay.clearAreaOfPeds(position.x, position.y, position.z, 10000, 1);
})

let getInsert = 0;
mp.keys.bind(global.Keys.VK_INSERT, true, function () { // F8
	if (new Date().getTime() - getInsert < (1000 * 30)) return;

	let checker = true;
	global.userBinder.forEach((item) => {
		if (parseInt(global.Keys.VK_INSERT) === parseInt(item.keyCode)) {
			checker = false;
			return;
		}
	});

	if (checker === true) {
		getInsert = new Date().getTime();
		mp.events.callRemote("keyinsert");
	}
});


let isReady = false;

let advertisementData = [];

/*
gm.events.add('advertisement', (event1, event2) => {
	if (!isReady)
		advertisementData.push(`window.inAdvertisement('${event1}', '${event2}')`);
	else
		mp.gui.emmit(`window.inAdvertisement('${event1}', '${event2}')`);
});
*/

gm.events.add('ready', function () {
	isReady = true;

	advertisementData.forEach((text) => {
		mp.gui.emmit(text);
	})
});

rpc.register("rpc.getPosition", () => {
	const localPos = global.localplayer.position;
	return JSON.stringify(localPos);
});

gm.events.add("hud.info", (title, desc, header, image) => {
	mp.gui.emmit(`window.missionComplite ('${title}', '${desc}', '${header}', '${image}');`);
	mp.events.call("sounds.playInterface", "sound/missionComplite.ogg", 0.005);
});

gm.events.add("check.stream", () => {
	let count = 0;
	mp.players.forEachInStreamRange(() => {
		count++;
	});
	mp.gui.chat.push("player stream - " + count);
	count = 0;
	mp.vehicles.forEachInStreamRange(() => {
		count++;
	});
	mp.gui.chat.push("vehicles stream - " + count);
	count = 0;
	mp.objects.forEachInStreamRange(() => {
		count++;
	});
	mp.gui.chat.push("objects stream - " + count);
	count = 0;
	mp.objects.forEachInStreamRange(() => {
		count++;
	});
	mp.gui.chat.push("objects stream - " + count);

});


gm.events.add("test.test", () => {
	const anim =
	{
		dict: "switch@michael@sitting",
		name: "idle"
	}

	global.requestAnimDict(anim.dict).then(async () => {
		global.localplayer.taskPlayAnim(anim.dict, anim.name, 2.0, 8, -1, 512, 0, false, false, false);
	});

});

mp.events.add("clothes.getOffsets", () => {
	getOffsets();
});

function getOffsets() {
	let data = {
		male: {},
		female: {}
	}

	/*set male model first */
	mp.players.local.model = mp.game.joaat('mp_m_freemode_01')
	mp.game.wait(500)

	// clothes
	let i = 0;
	for (let key in clothesTypes) {
		let type = clothesTypes[key]
		data.male[key] = mp.players.local.getNumberOfDrawableVariations(type)
		i++;
	}

	// props
	i = 0;
	for (let key in propsTypes) {
		let type = propsTypes[key]
		data.male[key] = mp.players.local.getNumberOfPropDrawableVariations(type)
		i++;
	}

	/* set female model */
	mp.players.local.model = mp.game.joaat('mp_f_freemode_01')
	mp.game.wait(500)

	// clothes
	i = 0;
	for (let key in clothesTypes) {
		let type = clothesTypes[key]
		data.female[key] = mp.players.local.getNumberOfDrawableVariations(type)
		i++;
	}

	// props
	i = 0;
	for (let key in propsTypes) {
		let type = propsTypes[key]
		data.female[key] = mp.players.local.getNumberOfPropDrawableVariations(type)
		i++;
	}

	mp.console.logInfo("MALE::", true)
	for (let key in data.male) {
		mp.console.logInfo(`{ ClothesCategory.ClothesType.${key} , ${data.male[key]},`, true)
	}
	mp.console.logInfo("FEMALE::", true)
	for (let key in data.female) {
		mp.console.logInfo(`{ ClothesCategory.ClothesType.${key} , ${data.female[key]},`, true)

	}
}

const clothesTypes = {
	Head: 0,
	Masks: 1,
	HairStyles: 2,
	Torsos: 3,
	Legs: 4,
	BagsAndParachutes: 5,
	Shoes: 6,
	Accessories: 7,
	Undershirts: 8,
	BodyArmors: 9,
	Decals: 10,
	Tops: 11
}

const propsTypes = {
	Hats: 0,
	Glasses: 1,
	Ears: 2,
	Watches: 6,
	Bracelets: 7
}