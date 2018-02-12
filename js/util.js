//暂时先将大部分工具存放在util.js文件中
//后期看能不能分开

/*
	ajax函数
*/
function ajax(url,option){
	//option对象属性可以有success，failed，method
	var success = option.success,
		failed  = option.failed,
		method  = option.method,
		data    = option.data;
	
	//遍历对象,将数据转换成查询字符串
	var queryStr = "";
	if(data){
		var arr = [];
		for(var prop in data){
			var temp = encodeURIComponent(prop) + "=" + encodeURIComponent(data[prop]);
			arr.push(temp);
		}
		queryStr = arr.join("&");
		//queryStr = encodeURIComponent(queryStr);//中文需要编码

	}
	//转换成大写，方便后续比较
	if(method) method = method.toUpperCase();
	
	var xhr = null;
	
	if(XMLHttpRequest){
		xhr = new XMLHttpRequest();//标准浏览器
	}else {
		xhr = new ActiveXObject("Microsoft.XMLHttp");
	}

	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4){
			if(xhr.status == 200){
				success(xhr.responseText);
			}else{
				//状态码不是200，提示连接出错
				failed && failed("Error:" + xhr.status);
			}
		}
		
	}
	
	if(method && method === "POST"){
		//post方法
		url += "?timestamp=" + new Date().getTime();
		xhr.open("post",url,true);
		xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xhr.send(queryStr);
	}else{
		//get方法
		url = url+"?"+queryStr;
		url += "&timestamp="+new Date().getTime();
		xhr.open("get",url,true);
		xhr.send(null);
	}
}

/*
	$选择函数
	暂时只支持id
*/
function $(id){
	return document.getElementById(id);
}


/*********************************
*	     Element之class操作      *
**********************************/

Element.prototype.hasClass = function(classname){
	//两边加上空格用来防止出现某个具体class的字符包含，例如red和redColor
	return ('' + this.className + '').indexOf(''+ classname + '') > -1;

}

Element.prototype.addClass = function(classname){
	if(this.hasClass(classname)){
		return false;
	}
	this.className = this.className.trim();
	var adder = this.className ? (" "+classname) : classname;
	this.className += adder;
}
//使用removeClass之前不需要做判断
Element.prototype.removeClass = function(classname){

	if(!this.hasClass(classname)) return false;

	var classes = this.className.split(' ');
	
	for(var i=0; i<classes.length; i++){
		//如果找到，删除之
		if(classes[i] == classname){
			var removed = classes.splice(i,1);
			this.className = classes.join(" ");
			return removed;
		}
	}
}

var EventUtil = {
	addEvent: function(element,event,callback){
			if(element.addEventListener){
				element.addEventListener(event,callback,false);//标准浏览器
			}else if(window.attachEvent){
				window.attachEvent("on"+event,callback);//IE8
			}else {
				element["on"+event]=callback;//DOM 0级
			}
	},
	removeEvent: function(element,event){
		if(element.removeEventListener){
			element.removeEventListener(event,false);
		}else if(window.detachEvent){
			window.detachEvent("on"+event);
		}else{
			element["on"+event] = null;
		}
	}
}