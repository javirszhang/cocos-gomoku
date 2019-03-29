(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Gumoku.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '029b1fnkdJEkaIzzcY+PR2C', 'Gumoku', __filename);
// scripts/Gumoku.js

'use strict';

// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        chessPrefab: {
            default: null,
            type: cc.Prefab
        },
        chessList: {
            default: [],
            type: [cc.node]
        },
        gameState: "white",
        whiteChessFrame: {
            default: null,
            type: cc.SpriteFrame
        },
        blackChessFrame: {
            default: null,
            type: cc.SpriteFrame
        },
        lastChess: {
            default: null,
            type: cc.Node,
            visible: false
        }
    },
    initiateChessBoard: function initiateChessBoard() {
        var $this = this;
        for (var x = 0; x < 15; x++) {
            for (var y = 0; y < 15; y++) {
                var newChess = cc.instantiate(this.chessPrefab);
                this.node.addChild(newChess);
                newChess.setPosition(cc.v2(x * 40 + 20, y * 40 + 20));
                newChess.getComponent('chess').tag = y * 15 + x; //tag除以15，商为Y坐标，余数为x坐标
                newChess.on(cc.Node.EventType.TOUCH_END, function (event) {
                    var thisNode = event.target.getComponent(cc.Sprite);
                    if ($this.gameState === 'white' && thisNode.spriteFrame == null) {
                        thisNode.spriteFrame = $this.whiteChessFrame;
                        $this.gameState = 'black';
                        $this.lastChess = thisNode;
                        $this.judgeOver();
                    } else if ($this.gameState == 'black' && thisNode.spriteFrame == null) {
                        thisNode.spriteFrame = $this.blackChessFrame;
                        $this.gameState = 'white';
                        $this.lastChess = thisNode;
                        $this.judgeOver();
                    }
                });
                this.chessList.push(newChess);
            }
        }
    },

    //判定胜负
    judgeOver: function judgeOver() {
        console.log("开始判定胜负");
        var tag = this.lastChess.getComponent('chess').tag;
        var x = tag % 15;
        var y = (tag - x) / 15;
        var lastSpriteFrame = this.lastChess.getComponent(cc.Sprite).spriteFrame;
        //横向
        var horizental = 0;
        var isLinked = true; //是否是连子
        for (var i = x - 4; i <= x + 4; i++) {
            //前四后四一共9颗子
            if (i >= 0 && i < 15) {
                var frame = this.chessList[i * 15 + y].getComponent(cc.Sprite).spriteFrame;
                if (lastSpriteFrame == frame && isLinked) {
                    horizental++; //连子数量
                    isLinked = true;
                } else {
                    //horizental = 0;//重置连子数量
                    if (horizental > 0) {
                        isLinked = false;
                    }
                }
            }
        }
        console.log(this.gameState + '横向连子数量:' + horizental);
        if (horizental >= 5) {
            console.log(this.gameState + " win !");
            return;
        }
        //纵向
        var vertical = 0;
        isLinked = true;
        for (var i = y - 4; i <= y + 4; i++) {
            if (i >= 0 && i < 15) {
                var frame = this.chessList[y * 15 + i].getComponent(cc.Sprite).spriteFrame;
                if (lastSpriteFrame == frame && isLinked) {
                    vertical++; //连子数量
                    isLinked = true;
                } else {
                    //horizental = 0;//重置连子数量
                    if (vertical > 0) {
                        isLinked = false;
                    }
                }
            }
        }
        console.log(this.gameState + "纵向连子数量:" + vertical);
        if (vertical >= 5) {
            console.log(this.gameState + " win !");
            return;
        }
        //左斜（第一与第三象限）
        var leftSlash = 0;
        var f = y - x; //斜率K = (y2-y1)/(x2-x1); 此k=1，y2=x2+y1-x1; 设f = y1-x1,那么y2 = x2+f，z = y2*15+x2;遍历x2,z = (f+x2)*15+x2
        for (var i = 0; i < 15; i++) {
            if (f + i < 0 || f + i > 14) {
                continue;
            }
            var frame = this.chessList[(f + i) * 15 + i].getComponent(cc.Sprite).spriteFrame;
            if (frame == lastSpriteFrame) {
                leftSlash++;
            } else {
                leftSlash = 0;
            }
        }
        console.log(this.gameState + "左斜连子数量:" + leftSlash);
        if (leftSlash >= 5) {
            console.log(this.gameState + " win !");
            return;
        }
        //右斜
        var rightSlash = 0;
        f = y + x;
        for (var i = 0; i < 15; i++) {
            if (f - i < 0 || f - i > 14) {
                continue;
            }
            var frame = this.chessList[(f - i) * 15 + i].getComponent(cc.Sprite).spriteFrame;
            if (frame == lastSpriteFrame) {
                rightSlash++;
            } else {
                rightSlash = 0;
            }
        }
        console.log(this.gameState + "右斜连子数量:" + rightSlash);
        if (rightSlash >= 5) {
            console.log(this.gameState + " win !");
            return;
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.initiateChessBoard();
    },
    start: function start() {}
}

// update (dt) {},
);

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=Gumoku.js.map
        