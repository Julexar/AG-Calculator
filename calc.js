//XP, Gold and Res Calculator for the AG
//Script made by Julexar (https://app.roll20.net/users/9989180/julexar), original by BlackJet (https://app.roll20.net/users/4499315/blackjet134)

//API Commands:
//!calc - gives the GM a menu with the Options.

var Calculator = Calculator || (function() {
    'use strict';
    
    var version="1.0",
    
    setDefaults = function() {
        state.value = {
            now: {
                xp: 0,
                gp: 0,
                res: 0,
                ms: "No",
                monsters: [0,0,1.8,0,1.4,0,1.2,0,1,0,2,0,3,0,4,0,5,0,6,0,7,0,8,0,9,0,10,0,11,0,12,0,13,0,14,0,15,0,16,0,17,0,18,0,19,0,20,0,21,0,22,0,23,0,24,0,25,0,26,0,27,0,28,0,29,0,30,0],
                playernum: 0,
                div: 1,
                playlev: "1-2",
                mult: 1,
                rp: 0,
                maxres: 0,
            }
        };
    },
    
    handleInput = function(msg) {
        var args = msg.content.split(",");
        
        if (msg.type !== "api") {
			return;
		}
        if (playerIsGM(msg.playerid)) {
            switch (args[0]) {
                case '!calc':
                    calcmenu();
                    break;
                case '!getmonsters':
                    getmonsters();
                    break;
                case '!addmon':
                    addmon(args[1],args[2]);
                    getmonsters();
                    break;
                case '!remmon':
                    remmon(args[1],args[2]);
                    getmonsters();
                    break;
                case '!setplayers':
                    if (Number(args[1])&&Number(args[1])>0) {
                        state.value.now.playernum=args[1];
                    }
                    calcmenu();
                    break;
                case '!setlevel':
                    setlevel(args[1]);
                    calcmenu();
                    break;
                case '!multishot':
                    if (args[1]=="Yes") {
                        state.value.now.mult=1.2;
                    } else {
                        state.value.now.mult=1;
                    }
                    state.value.now.ms=args[1];
                    break;
                case '!setrp':
                    state.value.now.rp=Number(args[1]);
                    calcmenu();
                    break;
                case '!calculate':
                    calc();
                    calcmenu();
                    break;
            }
        }
    },
    
    calcmenu = function() {
        var divstyle = 'style="width: 220px; border: 1px solid black; background-color: #ffffff; padding: 5px;"';
        var astyle1 = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 100px;';
        var astyle2 = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 150px;';
        var tablestyle = 'style="text-align:center;"';
        var arrowstyle = 'style="border: none; border-top: 3px solid transparent; border-bottom: 3px solid transparent; border-left: 195px solid rgb(126, 45, 64); margin-bottom: 2px; margin-top: 2px;"';
        var headstyle = 'style="color: rgb(126, 45, 64); font-size: 18px; text-align: left; font-variant: small-caps; font-family: Times, serif;"';
        var substyle = 'style="font-size: 11px; line-height: 13px; margin-top: -3px; font-style: italic;"';
        sendChat('AG Calculator','<div ' + divstyle + '>' + //--
            '<div ' + headstyle + '>AG Calculator</div>' + //--
            '<div ' + substyle + '>Menu</div>' + //--
            '<div ' + arrowstyle + '></div>' + //--
            '<table>' + //--
            '<tr><td>Number of Players: </td><td><a ' + astyle1 + '" href="!setplayers,?{Amount?|1}">' + state.value.now.playernum + '</a></td></tr>' + //--
            '<tr><td>Levelrange: </td><td><a ' + astyle1 + '" href="!setlevel,?{Level?|1-2|3-4|5-7|6-8|7-9|8-10|11-13|12-14|13-15|14-16|17-19|18-20|20-30}">' + state.value.now.playlev + '</a></td></tr>' + //--
            '<tr><td>Multishot: </td><td><a ' + astyle1 + '" href="!multishot,?{Value?|Yes|No}">' + state.value.now.ms + '</a></td></tr>' + //--
            '<tr><td>RP Percentage: </td><td><a ' + astyle1 + '" href="!setrp,?{Value?|1}">' + state.value.now.rp + '</a></td></tr>' + //--
            '</table>' + //--
            '<br>' + //--
            '<br>Total Res: ' + state.value.now.res + //--
            '<br>XP per Player: ' + state.value.now.xp + //--
            '<br>GP per Player: ' + state.value.now.gp + //--
            '<br><br>' + //--
            '<div style="text-align:center;"><a ' + astyle2 + '" href="!getmonsters">View Monsters</a></div>' + //--
            '<div style="text-align:center;"><a ' + astyle2 + '" href="!calculate">Calculate Rewards</a></div>' + //--
            '</div>'
        );
    },
    
    getmonsters = function() {
        var monsterlist=state.value.now.monsters;
        var text="";
        for (let i=1;i<monsterlist.length;i+=2) {
            if (Number(monsterlist[i])>0) {
                if (Number(monsterlist[i])>1) {
                    if (Number(monsterlist[i-1])==1.8) {
                        text+=monsterlist[i]+" CR 1/8"+" Monsters<br>";
                    } else if (Number(monsterlist[i-1])==1.4) {
                        text+=monsterlist[i]+" CR 1/4"+" Monsters<br>";
                    } else if (Number(monsterlist[i-1])==1.2) {
                        text+=monsterlist[i]+" CR 1/2"+" Monsters<br>";
                    } else {
                        text+=monsterlist[i]+" CR "+monsterlist[i-1]+" Monsters<br>";
                    }
                } else {
                    if (Number(monsterlist[i-1])==1.8) {
                        text+=monsterlist[i]+" CR 1/8"+" Monster<br>";
                    } else if (Number(monsterlist[i-1])==1.4) {
                        text+=monsterlist[i]+" CR 1/4"+" Monster<br>";
                    } else if (Number(monsterlist[i-1])==1.2) {
                        text+=monsterlist[i]+" CR 1/2"+" Monster<br>";
                    } else {
                        text+=monsterlist[i]+" CR "+monsterlist[i-1]+" Monsters<br>";
                    }
                }
            }
        }
        var divstyle = 'style="width: 220px; border: 1px solid black; background-color: #ffffff; padding: 5px;"';
        var astyle1 = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 100px;';
        var astyle2 = 'style="text-align:center; border: 1px solid black; margin: 1px; background-color: #7E2D40; border-radius: 4px;  box-shadow: 1px 1px 1px #707070; width: 150px;';
        var tablestyle = 'style="text-align:center;"';
        var arrowstyle = 'style="border: none; border-top: 3px solid transparent; border-bottom: 3px solid transparent; border-left: 195px solid rgb(126, 45, 64); margin-bottom: 2px; margin-top: 2px;"';
        var headstyle = 'style="color: rgb(126, 45, 64); font-size: 18px; text-align: left; font-variant: small-caps; font-family: Times, serif;"';
        var substyle = 'style="font-size: 11px; line-height: 13px; margin-top: -3px; font-style: italic;"';
        sendChat("AG Calculator", "/w gm <div " + divstyle + ">" + //--
            '<div ' + headstyle + '>Monster</div>' + //--
            '<div ' + substyle + '>Menu</div>' + //--
            '<div ' + arrowstyle + '></div>' + //--
            text + //--
            '<br>' + //--
            '<div style="text-align:center;"><a ' + astyle2 + '" href="!addmon,?{CR?|0|1/8|1/4|1/2|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|23|24|25|26|27|28|29|30},?{Amount?|1}">Add Monsters</a></div>' + //--
            '<div style="text-align:center;"><a ' + astyle2 + '" href="!remmon,?{CR?|0|1/8|1/4|1/2|1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|23|24|25|26|27|28|29|30},?{Amount?|1}">Remove Monsters</a></div>' + //--
            '<div style="text-align:center;"><a ' + astyle2 + '" href="!calc">Go Back</a></div>' + //--
            '</div>'
        );
    },
    
    addmon = function(cr,amount) {
        var monsterlist=state.value.now.monsters;
        if (cr=="1/8") {
            cr=1.8;
        } else if (cr=="1/4") {
            cr=1.4;
        } else if (cr=="1/2") {
            cr=1.2;
        } else {
            cr=Number(cr);
        }
        amount=Number(amount);
        for (let i=0;i<monsterlist.length;i+=2) {
            if (Number(monsterlist[i])==cr) {
                monsterlist[i+1]=(Number(monsterlist[i+1])+amount);
            }
        }
        state.value.now.monsters=monsterlist;
    },
    
    remmon = function(cr,amount) {
        var monsterlist=state.value.now.monsters;
        if (cr=="1/8") {
            cr=1.8;
        } else if (cr=="1/4") {
            cr=1.4;
        } else if (cr=="1/2") {
            cr=1.2;
        } else {
            cr=Number(cr);
        }
        amount=Number(amount);
        for (let i=0;i<monsterlist.length;i+=2) {
            if (Number(monsterlist[i])==cr) {
                monsterlist[i+1]=(Number(monsterlist[i+1])-Number(amount));
                if (Number(monsterlist[i+1])<0) {
                    monsterlist[i+1]=0;
                }
            }
        }
        state.value.now.monsters=monsterlist;
    },
    
    calc = function() {
        var monsterlist=state.value.now.monsters;
        var xp=0;
        var val=25;
        
        for (let i=1;i<monsterlist.length;i+=2) {
            if (Number(monsterlist[i])>0) {
                if (Number(monsterlist[i-1])==0) {
                    xp+=10*Number(monsterlist[i]);
                } else if (Number(monsterlist[i-1])==1.8) {
                    xp+=25*Number(monsterlist[i]);
                } else if (Number(monsterlist[i-1])==1.4) {
                    xp+=50*Number(monsterlist[i]);
                } else if (Number(monsterlist[i-1])==1.2) {
                    xp+=100*Number(monsterlist[i]);
                } else if (Number(monsterlist[i-1])==1) {
                    xp+=200*Number(monsterlist[i]);
                } else if (Number(monsterlist[i-1])==2) {
                    xp+=450*Number(monsterlist[i]);
                } else if (Number(monsterlist[i-1])==3) {
                    xp+=700*Number(monsterlist[i]);
                } else if (Number(monsterlist[i-1])==4) {
                    xp+=1100*Number(monsterlist[i]);
                } else if (Number(monsterlist[i-1])==5) {
                    xp+=1800*Number(monsterlist[i]);
                } else if (Number(monsterlist[i-1])==6) {
                    xp+=2300*Number(monsterlist[i]);
                } else if (Number(monsterlist[i-1])==7) {
                    xp+=2900*Number(monsterlist[i]);
                } else if (Number(monsterlist[i-1])==8) {
                    xp+=3900*Number(monsterlist[i]);
                } else if (Number(monsterlist[i-1])==9) {
                    xp+=5000*Number(monsterlist[i]);
                } else if (Number(monsterlist[i-1])==10) {
                    xp+=5900*Number(monsterlist[i]);
                } else if (Number(monsterlist[i-1])==11) {
                    xp+=7200*Number(monsterlist[i]);
                } else if (Number(monsterlist[i-1])==12) {
                    xp+=8400*Number(monsterlist[i]);
                } else if (Number(monsterlist[i-1])==13) {
                    xp+=10000*Number(monsterlist[i]);
                } else if (Number(monsterlist[i-1])==14) {
                    xp+=11500*Number(monsterlist[i]);
                } else if (Number(monsterlist[i-1])==15) {
                    xp+=13000*Number(monsterlist[i]);
                } else if (Number(monsterlist[i-1])==16) {
                    xp+=15000*Number(monsterlist[i]);
                } else if (Number(monsterlist[i-1])==17) {
                    xp+=18000*Number(monsterlist[i]);
                } else if (Number(monsterlist[i-1])==18) {
                    xp+=20000*Number(monsterlist[i]);
                } else if (Number(monsterlist[i-1])==19) {
                    xp+=22000*Number(monsterlist[i]);
                } else if (Number(monsterlist[i-1])==20) {
                    xp+=25000*Number(monsterlist[i]);
                } else if (Number(monsterlist[i-1])==21) {
                    xp+=33000*Number(monsterlist[i]);
                } else if (Number(monsterlist[i-1])==22) {
                    xp+=41000*Number(monsterlist[i]);
                } else if (Number(monsterlist[i-1])==23) {
                    xp+=50000*Number(monsterlist[i]);
                } else if (Number(monsterlist[i-1])==24) {
                    xp+=62000*Number(monsterlist[i]);
                } else if (Number(monsterlist[i-1])==25) {
                    xp+=75000*Number(monsterlist[i]);
                } else if (Number(monsterlist[i-1])==26) {
                    xp+=90000*Number(monsterlist[i]);
                } else if (Number(monsterlist[i-1])==27) {
                    xp+=105000*Number(monsterlist[i]);
                } else if (Number(monsterlist[i-1])==28) {
                    xp+=120000*Number(monsterlist[i]);
                } else if (Number(monsterlist[i-1])==29) {
                    xp+=135000*Number(monsterlist[i]);
                } else if (Number(monsterlist[i-1])==30) {
                    xp+=155000*Number(monsterlist[i]);
                }
            }
        }
        var rp=Number(state.value.now.rp);
        xp=(xp*rp)+xp;
        var maxres=Number(state.value.now.maxres);
        var res;
        var gp;
        if (Number(state.value.now.playernum)>0) {
            res=Math.floor((xp/Number(state.value.now.div))*Number(state.value.now.mult));
            if (state.value.now.res>maxres) {
                state.value.now.res=maxres;
            }
            xp=Math.floor(xp/Number(state.value.now.playernum));
            gp=Math.floor(res/Number(state.value.now.playernum)*Number(state.value.now.mult));
        }
        if (!res) {
            res=0;
        }
        if (!gp) {
            gp=0;
        }
        state.value.now.xp=xp;
        state.value.now.res=res;
        state.value.now.gp=gp;
    },
    
    setlevel = function(level) {
        var levels=level.split('-');
        levels=Number(levels[0]);
        if (levels<=10) {
            state.value.now.div=4.5;
        } else if (levels<=16) {
            state.value.now.div=4;
        } else {
            state.value.now.div=3;
        }
        state.value.now.playlev=String(level);
    },
    
    checkInstall = function() {
        if (!state.value) {
            setDefaults();
        }
    },
    
    registerEventHandlers = function() {
        on('chat:message', handleInput);
	};

	return {
	    CheckInstall: checkInstall,
		RegisterEventHandlers: registerEventHandlers
	};
}());
on('ready',function(){
    'use strict';
    Calculator.CheckInstall();
    Calculator.RegisterEventHandlers();
});
