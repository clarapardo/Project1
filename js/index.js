const pangApp = {
    name: 'PANG',
    description: 'Project 1',
    version: '1.0.0',
    author: 'HA & CP',
    license: undefined,

    gameSize: { w: undefined, h: undefined },
    canvasNode: undefined,
    ctx: undefined,
    player1: undefined,
    lives1: [],
    bullets1: [],
    enemies1: [],
    livesCounter: 3,
    frameCounter: 0,



    init(canvasID) {
        this.canvasNode = document.querySelector(`#${canvasID}`)
        this.ctx = this.canvasNode.getContext('2d')

        this.setDimensions()
        this.createPlayer()
        this.createPlatformStairs()
        this.drawAll()
        this.createLives()
        this.createEnemies()

        this.setEventListeners()
        this.start()
    },

    setDimensions() {
        this.gameSize = {
            w: this.canvasNode.getAttribute('width'),
            h: this.canvasNode.getAttribute('height')
        }
    },




    // Scenario creation and drawing
    drawAll() {
        this.drawGround()
        this.drawHeader()

        this.catchLives()
        this.platform1.draw()
        this.player1.draw()
        this.bullets1.forEach((eachBullet) => {
            eachBullet.draw()
        })
        this.enemies1.forEach((eachElement) => {
            eachElement.draw()
        })
        this.bulletEnemyCollision()


        if (this.frameCounter > 150 && this.frameCounter < 500) {
            this.generateLives()

        } else if (this.frameCounter === 1000) {
            this.frameCounter = 0
            this.createLives()
        }


    },

    drawGround() {
        this.ctx.fillStyle = 'black'
        this.ctx.fillRect(0, 630, this.gameSize.w, 20)
    },

    drawHeader() {
        this.ctx.fillStyle = 'black'
        this.ctx.fillRect(0, 0, this.gameSize.w, 45)
    },

    createPlayer() {
        this.player1 = new Player(this.ctx, this.gameSize.w / 2, this.gameSize.h - 95, 75, 75, this.gameSize)
    },

    createPlatformStairs() {
        this.platform1 = new PlatformsStairs(this.ctx, this.gameSize, 300, 375, 700, 300)
    },

    createLives() {
        this.lives1.push(new Lives(this.ctx, this.platform1.platformPos.x, this.platform1.platformPos.y))
    },

    createBullets() {
        this.bullets1.push(new Bullets(this.ctx, this.player1.playerPos.x, this.player1.playerPos.y, this.player1.playerSize.w, this.player1.playerSize.h))
    },

    createEnemies() {
        this.enemies1.push(new Enemies(this.ctx, this.gameSize, 250, 250))
        console.log(this.enemies1)
    },



    // Player's movement
    setEventListeners() {
        document.onkeydown = event => {
            const { key } = event

            if (key === 'ArrowLeft') {

                if (this.player1.playerPos.y + this.player1.playerSize.h === this.platform1.platformPos.y) {
                    if (this.player1.playerPos.x <= this.platform1.platformPos.x) {
                    } else {
                        this.player1.moveLeft()
                    }
                } else if (this.player1.playerPos.y + this.player1.playerSize.h !== this.platform1.stairPos.y + this.platform1.stairSize.h && this.player1.playerPos.y + this.player1.playerSize.h !== this.platform1.platformPos.y) {
                } else {
                    this.player1.moveLeft()
                }
            }
            if (key === 'ArrowRight') {
                if (this.player1.playerPos.y + this.player1.playerSize.h === this.platform1.platformPos.y) {
                    if (this.player1.playerPos.x + this.player1.playerSize.w >= this.platform1.platformPos.x + this.platform1.platformSize.w) {
                    } else {
                        this.player1.moveRight()
                    }
                } else if (this.player1.playerPos.y + this.player1.playerSize.h !== this.platform1.stairPos.y + this.platform1.stairSize.h && this.player1.playerPos.y + this.player1.playerSize.h !== this.platform1.platformPos.y) {
                } else {
                    this.player1.moveRight()
                }
            }
            if (key === 'ArrowUp') {
                if (this.player1.playerPos.x + this.player1.playerSize.w <= this.platform1.stairPos.x + this.platform1.stairSize.w && this.player1.playerPos.x + this.player1.playerSize.w >= this.platform1.stairPos.x) {

                    if (this.player1.playerPos.y + this.player1.playerSize.h <= this.platform1.platformPos.y) {
                        this.player1.playerPos.y = this.platform1.platformPos.y - this.player1.playerSize.h
                    } else {
                        this.player1.moveUp()
                    }
                }
            }
            if (key === 'ArrowDown') {
                if (this.player1.playerPos.x > this.platform1.stairPos.x && this.player1.playerPos.x < this.platform1.stairPos.x + this.platform1.stairSize.w) {

                    if (this.player1.playerPos.y >= this.gameSize.h - 95) {
                        this.player1.playerPos.y = this.gameSize.h - 95
                    } else {
                        this.player1.moveDown()
                    }
                }
            }
            if (key === ' ') {
                this.createBullets()
            }
        }
    },

    start() {
        setInterval(() => {
            this.clearAll()
            this.drawAll()
            this.frameCounter++

        }, 30)
    },

    clearAll() {
        this.ctx.clearRect(0, 0, this.gameSize.w, this.gameSize.h)
    },




    // Lives - power ups
    generateLives() {
        this.lives1[0]?.draw()
    },

    catchLives() {
        this.lives1?.forEach((elmnt) => {

            if (this.player1.playerPos.y === this.platform1.platformPos.y - this.player1.playerSize.h && this.player1.playerPos.x + this.player1.playerSize.w <= elmnt.livesPos.x + elmnt.livesSize.w && this.player1.playerPos.x + this.player1.playerSize.w >= elmnt.livesPos.x) {
                if (this.livesCounter <= 3) {
                    this.livesCounter++
                }
                this.lives1 = []
            }
        }


        )
    },



    // Enemies

    bulletEnemyCollision() {
        // console.log(this.enemies1[0].enemyPos)

        this.bullets1.forEach(eachBullet => {

            if (this.enemies1[0].enemyPos.x < eachBullet.bulletPos.x + eachBullet.bulletSize.w &&
                this.enemies1[0].enemyPos.x + this.enemies1[0].enemySize.w > eachBullet.bulletPos.x &&
                this.enemies1[0].enemyPos.y < eachBullet.bulletPos.y + eachBullet.bulletSize.h &&
                this.enemies1[0].enemySize.h + this.enemies1[0].enemyPos.y > eachBullet.bulletPos.y) {

                console.log('colisión')



            }



        })

    }



}