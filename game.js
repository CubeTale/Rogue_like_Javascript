import chalk, { colors } from 'chalk';
import readlineSync from 'readline-sync';


// 플레이어, 몬스터 공격력 증가변수
let playerPlusAttack;
let monsterPlusAttack;

playerPlusAttack = Math.floor(Math.random() * (6 - 4) + 4);
monsterPlusAttack = Math.floor(Math.random() * (4 - 2) + 2);
class Player {
    constructor(hp) {
        this.hp = hp;
        this.playerPlusAttack = playerPlusAttack;
        this.pAttackMax = 12 + playerPlusAttack;
        this.pAttackMin = 9 + playerPlusAttack;
    }

    attack() {
        // 플레이어의 공격
        return this.pAttack = Math.floor(Math.random() * (this.pAttackMax - this.pAttackMin) + this.pAttackMin);
    }

    damaged(mDamage) {
        return this.hp -= mDamage;
    }
}

class Monster {
    constructor(stage) {
        this.hp = stage * Math.floor(Math.random() * (17 - 12) + 12);
        this.monsterPlusAttack = stage * (Math.floor(Math.random() * (4 - 2) + 2));
        this.mAttackMax = 5 + this.monsterPlusAttack;
        this.mAttackMin = 2 + this.monsterPlusAttack;
    }

    attack() {
        // 몬스터의 공격
        return this.mAttack = Math.floor(Math.random() * (this.mAttackMax - this.mAttackMin) + this.mAttackMin);
    }

    damaged(pDamage) {
        return this.hp -= pDamage;
    }
}

function displayStatus(stage, player, monster) {
    console.log(chalk.magentaBright(`\n=== Current Status ===`));
    console.log(
        chalk.cyanBright(`| Stage: ${stage} `) +
        chalk.blueBright(
            `| 플레이어 정보 Hp : ${player.hp}, Attack : ${player.pAttackMin} ~ ${player.pAttackMax} `,
        ) +
        chalk.redBright(
            `| 몬스터 정보 Hp : ${monster.hp}, Attack : ${monster.mAttackMin} ~ ${monster.mAttackMax} |`,
        ),
    );
    console.log(chalk.magentaBright(`=====================\n`));
}

const battle = async (stage, player, monster) => {
    let logs = [];

    while (player.hp > 0) {
        console.clear();
        displayStatus(stage, player, monster);

        logs.forEach((log) => console.log(log));

        console.log(
            chalk.green(
                `\n1. 공격한다.(95%) 2. 도망친다.(15%)`,
            ),
        );
        const choice = readlineSync.question('당신의 선택은? ');

        // 플레이어의 선택에 따라 다음 행동 처리
        logs.push(chalk.green(`${choice}를 선택하셨습니다.`));

        switch (choice) {
            case '1' :
                let cri = Math.floor(Math.random() * (100 - 1) + 1);
                let dodge = Math.floor(Math.random() * (100 - 1) + 1);
                let playerDamage = player.attack();
                let monsterDamage = monster.attack();
                if(cri <= 90 && dodge <= 95){
                    monster.damaged(playerDamage);
                    logs.push(chalk.blueBright(`몬스터에게 ${playerDamage}만큼 피해를 입혔습니다.`));
                } else if (cri > 90 && dodge <= 95) {
                    monster.damaged(playerDamage * 1.2);
                    logs.push(chalk.blueBright(`몬스터에게 ${playerDamage * 1.2}만큼 치명타피해를 입혔습니다.`));
                } else {
                    logs.push(chalk.redBright(`몬스터가 회피하였습니다.`))
                }
                cri = Math.floor(Math.random() * (100 - 1) + 1);
                dodge = Math.floor(Math.random() * (100 - 1) + 1);
                if(cri <= 95 && dodge <= 85){
                    player.damaged(monsterDamage);
                    logs.push(chalk.red(`플레이어가 ${monsterDamage}만큼 피해를 입었습니다.`));
                } else if (cri > 95 && dodge <= 85) {
                    player.damaged(monsterDamage * 1.3);
                    logs.push(chalk.red(`플레이어가 급소를 맞아 ${monsterDamage * 1.3}만큼 피해를 입었습니다.`));
                } else {
                    logs.push(chalk.greenBright(`플레이어가 회피하였습니다.`))
                }
                break;
            case '2' :
                let run = Math.floor(Math.random() * (100 - 1) + 1);
                
                if (run <= 15) {
                    logs.push(chalk.yellowBright(`도망에 성공하였습니다.`));
                    monster.hp = 0;
                } else {
                    let cri = Math.floor(Math.random() * (100 - 1) + 1);
                    let monsterDamage = monster.attack();
                    if(cri <= 95){
                        player.damaged(monsterDamage);
                        logs.push(chalk.red(`플레이어가 도망에 실패하여 ${monsterDamage}만큼 피해를 입었습니다.`));
                    } else {
                        player.damaged(monster.attack() * 1.3);
                        logs.push(chalk.red(`플레이어가 도망치다 급소를 맞아 ${monsterDamage * 1.3}만큼 피해를 입었습니다.`));
                    }
                }
                break;
        }
        // 몬스터 체력이 0이면 다음 스테이지로
        if (monster.hp <= 0) {
            player.hp += Math.floor(Math.random() * (64 - 42) + 42);
            break;
        }
    }
};

export async function startGame() {
    console.clear();
    const player = new Player(65);
    let stage = 1;

    while (stage <= 12) {
        const monster = new Monster(stage);
        
        await battle(stage, player, monster);

        // 스테이지 클리어 및 게임 종료 조건
        player.playerPlusAttack = Math.floor(Math.random() * (6 - 3) + 3);
        player.pAttackMax += player.playerPlusAttack;
        player.pAttackMin += player.playerPlusAttack;
        stage++;
        if ( player.hp <= 0 ) {
            console.log("패배하였습니다. 다시 도전해주세요!");
            break;
        }
    }
    if( stage >= 13 && player.hp > 0){
        console.log(chalk.cyan("클리어를 축하드립니다!!!"));
    }
}