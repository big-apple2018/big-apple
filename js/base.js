window.onload = function(){
	// firebaseコンフィグ
	var config = {
		apiKey: "AIzaSyApruF8W7NBxBqKJfsPFxTSZ5V8uMbZGjA",
		authDomain: "bigapple-e9fe1.firebaseapp.com",
		databaseURL: "https://bigapple-e9fe1.firebaseio.com",
		projectId: "bigapple-e9fe1",
		storageBucket: "bigapple-e9fe1.appspot.com",
		messagingSenderId: "502352594159"
	};
	
	firebase.initializeApp(config);
		
	// firestoreインスタンスの生成
	var db = firebase.firestore();
	
	// タイムスタンプの設定を記述
	var setting = { timestampsInSnapshots:true };
	db.settings(setting);
	
	// イベント取得クリック時
	document.getElementById("get_btn").onclick = function() {
		// 初期化
		document.getElementById("canvas").innerHTML = ""
		
		// イベント全件取得
		db.collection("events").get().then(function(querySnapshot) {
			querySnapshot.forEach(function(doc) {
				document.getElementById("canvas").innerHTML += 
					doc.get('event_date');;
				document.getElementById("canvas").innerHTML +=
					doc.get('event_name'); + " <br /> ";
				document.getElementById("canvas").innerHTML += "<hr />";
			});
		});
	};
	
	// // イベント追加クリック時
	document.getElementById("write_btn").onclick = function() {
		// フォームから値を取得
		var event_title = document.getElementById("event_title").value;
		var event_date  = document.getElementById("event_date").value;
		event_date = modEventDate(event_date);
		
		// 日付を取得
		var now = getNowDate();
		
		// イベント追加
		addEvent(db, "events", event_title, event_date, now);
		
		// フォームの初期化
		document.getElementById("event_title").value = "";
		document.getElementById("event_date").value = "";
	};

};

// イベント追加関数
function addEvent(db, doc, name, date, now){
	db.collection(doc).add({
		event_name: name,
		event_date: date,
		update_date: now,
	});
}
// 日付フォーマット変更処理
function modEventDate(date){
	var result = date.replace("-", "/");
	// "-"が存在する限り繰り返し
	while(result !== date) {
		date = date.replace("-", "/");
		result = result.replace("-", "/");
	}
	//TODO:スマホからだとyyyymdになるためyyyymmddに変換
	//     無理矢理だが今は動けば良いので機会があれば修正する。
	var tmpDate
	tmpDate = new Date(date);
	var yyyy = tmpDate.getFullYear();
	var mm   = ("00" + (tmpDate.getMonth()+1)).slice(-2);
	var dd   = ("00" + tmpDate.getDate()).slice(-2);
	var res  = yyyy + "/" + mm + "/" + dd;
	return res;
}

// 現在時刻の取得関数
function getNowDate(){
	var date = new Date();
	var yyyy = date.getFullYear();
	var mm   = ("00" + (date.getMonth()+1)).slice(-2);
	var dd   = ("00" + date.getDate()).slice(-2);
	var res  = yyyy + "/" + mm + "/" + dd;
	return res;
}
