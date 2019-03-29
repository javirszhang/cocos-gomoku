"use strict";
cc._RF.push(module, '029b1fnkdJEkaIzzcY+PR2C', 'Gumoku');
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
        },
        maskLayoutNode: {
            default: null,
            type: cc.Node
        }
    },
    //初始化棋盘
    initiateChessBoard: function initiateChessBoard() {
        //
        this.maskLayoutNode.active = false;
        var $this = this;
        for (var y = 0; y < 15; y++) {
            //纵坐标
            for (var x = 0; x < 15; x++) {
                //横坐标
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
        var currentPlayer = this.gameState == 'white' ? 'black' : 'white';
        var tag = this.lastChess.getComponent('chess').tag;
        var x = tag % 15;
        var y = (tag - x) / 15;
        console.log("X = " + x + ";Y = " + y);
        var lastSpriteFrame = this.lastChess.getComponent(cc.Sprite).spriteFrame;
        //横向

        var horizental = 0;

        for (var i = x - 4; i <= x + 4; i++) {
            //前四后四一共9颗子
            if (i >= 0 && i < 15) {
                // this.chessList[y*15+i].getComponent(cc.Sprite).spriteFrame = this.whiteChessFrame;

                var frame = this.chessList[y * 15 + i].getComponent(cc.Sprite).spriteFrame;
                if (lastSpriteFrame == frame) {
                    horizental++; //连子数量
                    console.log(currentPlayer + '横向连子数量:' + horizental);
                    if (horizental >= 5) {
                        this.showWinLayout(currentPlayer);
                        return;
                    }
                } else {
                    horizental = 0; //重置连子数量
                }
            }
        }

        //纵向
        var vertical = 0;
        for (var i = y - 4; i <= y + 4; i++) {
            if (i >= 0 && i < 15) {
                var index = i * 15 + x;
                // this.chessList[index].getComponent(cc.Sprite).spriteFrame = this.whiteChessFrame;

                var frame = this.chessList[index].getComponent(cc.Sprite).spriteFrame;
                if (lastSpriteFrame == frame) {
                    vertical++; //连子数量
                    console.log(currentPlayer + "纵向连子数量:" + vertical);
                    if (vertical >= 5) {
                        this.showWinLayout(currentPlayer);
                        return;
                    }
                } else {
                    vertical = 0; //重置连子数量
                }
            }
        }

        //左斜（第一与第三象限）

        var leftSlash = 0;
        var f = y - x; //斜率K = (y1-y)/(x1-x); 此k=1，y1=x1+y-x; 设f = y-x,那么y1 = x1+f，z = y*15+x;遍历x,z = (f+x)*15+x
        for (var i = 0; i < 15; i++) {
            if (f + i < 0 || f + i > 14) {
                continue;
            }
            // this.chessList[(f+i)*15+i].getComponent(cc.Sprite).spriteFrame = this.whiteChessFrame;

            var frame = this.chessList[(f + i) * 15 + i].getComponent(cc.Sprite).spriteFrame;
            if (frame == lastSpriteFrame) {
                leftSlash++;
                console.log(currentPlayer + "左斜连子数量:" + leftSlash);
                if (leftSlash >= 5) {
                    this.showWinLayout(currentPlayer);
                    return;
                }
            } else {
                leftSlash = 0;
            }
        }

        //右斜
        var rightSlash = 0;
        f = y + x;
        for (var i = 0; i < 15; i++) {
            if (f - i < 0 || f - i > 14) {
                continue;
            }
            // this.chessList[(f-i)*15+i].getComponent(cc.Sprite).spriteFrame = this.whiteChessFrame;

            var frame = this.chessList[(f - i) * 15 + i].getComponent(cc.Sprite).spriteFrame;
            if (frame == lastSpriteFrame) {
                rightSlash++;
                console.log(currentPlayer + "右斜连子数量:" + rightSlash);
                if (rightSlash >= 5) {
                    this.showWinLayout(currentPlayer);
                    return;
                }
            } else {
                rightSlash = 0;
            }
        }
    },

    //展示胜负结果（player = 'black' or 'white'）
    showWinLayout: function showWinLayout(player) {
        this.maskLayoutNode.getChildByName("judgeResult").getComponent(cc.Label).string = player + " win !";
        this.maskLayoutNode.active = true;
        console.log(player + " win !");
    },
    replayGomuku: function replayGomuku() {
        this.maskLayoutNode.active = false;
        for (var i in this.chessList) {
            this.chessList[i].getComponent(cc.Sprite).spriteFrame = null;
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