var timer = null,
    index = 0,
    pics = byId("banner").getElementsByTagName("div"), //array of pics
    dots = byId("dots").getElementsByTagName("span"), //array of span
    size = pics.length,
    prev = byId("prev"),
    next = byId("next"),
    menuItems = byId("menu-content").getElementsByTagName("div"), //first level menu
    subMenu = byId("sub-menu"), //2nd level menu
    subItems = subMenu.getElementsByClassName("inner-box"); //items within submenu

//cross browser
function addHandler(element, type, handler) {
    if (element.addEventListener) {
        element.addEventListener(type, handler, true);
    }
    else if (element.attachEvent) {
        element.attachEvent('on' + type, handler); //"on"click, onmousemove etc..
    }
    else {
        element['on' + type] = handler; //. can be replace with [], variable need to be place within []
    }
}

function removeHandler(element, type, handler){
    if(element.removeEventListener){
      element.removeEventListener(type, handler, true);
    } else if (element.detachEvent){
      element.detachEvent(type, handler);
    } else {
      element["on"+type] = null;
    }
}

//document.getElementById package
function byId(id){
	return typeof(id)==="string"?document.getElementById(id):id;
}

// Stop Auto
function stopAutoPlay(){
	if(timer){                 //if timer != null clear timer
       clearInterval(timer);
	}
}

// Auto
function startAutoPlay(){
   timer = setInterval(function(){ //every 3 sec, increase index by 1, calls changeImg()
       index++;
       if(index >= size){         //when index >=size(pic length), reset index=0
          index = 0;
       }
       changeImg();
   },3000)
}

function changeImg(){
   for(var i=0,len=dots.length;i<len;i++){ //loop thru and make all banner page display none        
       dots[i].className = "";
       pics[i].style.display = "none";
   }
   dots[index].className = "active";      //only display current index
   pics[index].style.display = "block";
}

// stop/start auto when touch content
function slideImg(){
    startAutoPlay();
    var main = byId("main");
    var banner = byId("banner");
    var menuContent = byId("menu-content");

    addHandler(main,"mouseover",stopAutoPlay);
    addHandler(main,"mouseout",startAutoPlay);

    // click dots to change image
    for(var i=0,len=dots.length;i<len;i++){
       dots[i].id = i; //id=0,1,2     
       addHandler(dots[i],"click",function(){
           index = this.id;
           changeImg();
       })
    }

    /*for(var i=0, len=dots.length;i<len;i++){
      dots[i].setAttribute("data-id", i);       //data-id:0,1,2
      addHandler(dots[i], "click", function(){
        index = this.getAttribute("data-id");
        changeImg();
      })
    }*/

    // Next Image
    addHandler(next,"click",function(){
       index++;
       if(index>=size) index=0;
       changeImg();
    })

    // Prev Image
    addHandler(prev,"click",function(){
       index--;
       if(index<0) index=size-1;
       changeImg();
    })

    // Menu changes
    for(var m=0,mlen=menuItems.length;m<mlen;m++){
      //set menu index
        menuItems[m].setAttribute("data-index",m);    //data-index:0,1,2,3
        addHandler(menuItems[m],"mouseover",function(){
            subMenu.className = "sub-menu";         //mouse hover over, display submenu CSS, remove hide class
            var idx = this.getAttribute("data-index"); //0,1,2,3
            for(var j=0,jlen=subItems.length;j<jlen;j++){ //loop thru, display 2nd menu to none
               subItems[j].style.display = 'none';
               menuItems[j].style.background = "none";
            }
            subItems[idx].style.display = "block";      //only display and set style to current index menu items
            menuItems[idx].style.background = "rgba(0,0,0,0.1)";
        });
    }

    //when enter 2nd menu, remove hide
    addHandler(subMenu,"mouseover",function(){
        this.className = "sub-menu";
    });

    //when leaving 2nd menu, add hide class
    addHandler(subMenu,"mouseout",function(){
        this.className = "sub-menu hide";
    });

    //when leaving banner
    addHandler(banner,"mouseout",function(){
        subMenu.className = "sub-menu hide"; //add hide class 
    });
    //when leaving entire menu container
    addHandler(menuContent,"mouseout",function(){
        subMenu.className = "sub-menu hide";
    });
}

addHandler(window,"load",slideImg);