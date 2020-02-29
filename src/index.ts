/*
const sayHi =(name: string, age: number, gender?: string): void=>{ //arg뒤에 ?가 붙으면 선택요소라는 것을 알려줌 -> 호출 시 해당 arg를 안써도 됨
    console.log(`Hello ${name}`);
    //return이 없으므로 함수는 void
}

호출 시 모든 arg를 써야함
sayHi("yunho", 24, "male");
*/


/*
interface Human{ 
    name: string, age: number, gender: string
}

const person ={
    name: "yunho",
    age: 24,
    gender: "male"
}

const sayHi =(person : Human)=>{ 
    console.log(`Hello ${person.name}, ${person.age}`);
}

sayHi(person);
*/


/*
interface -> only TS -> index.js에서 컴파일되지 않음 (안정성↑) -> interface 대신 class 사용가능

class Human{
    //JS에선 클래스의 속성(prop)을 묘사할 필요 없음
    //단, TS에서는 선언해야 함

    public name: string;
    public age: number;
    public gender: string;

    constructor(name: string, age: number, gender: string){ //클래스가 시작할때마다 호출되는 함수
        this.name = name;
        this.age = age;
        this.gender = gender;
    }
}

const lynn = new Human("lynn", 24, "female");
*/


import * as CryptoJS from "crypto-js"; //설치: yarn add crypto-js

class Block {
    public index: number;
    public hash: string;
    public previousHash: string;
    public data: string;
    public timestamp: number;

    //static -> 클래스 외부에서 함수호출 할 수 있음
    static calculateBlockHash = (index: number, previousHash: string, timestamp: number, data: string): string =>
        CryptoJS.SHA256(index + previousHash + timestamp + data).toString();

    static validateStructure = (aBlock: Block): boolean =>
        typeof aBlock.index === "number" && 
        typeof aBlock.hash === "string" &&
        typeof aBlock.previousHash === "string" && 
        typeof aBlock.timestamp === "number" &&
        typeof aBlock.data === "string";

    constructor(index: number, hash: string, previousHash: string, data: string, timestamp: number) {
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.data = data;
        this.timestamp = timestamp;
    }
}

const genesisBlock: Block = new Block(0, "2020202020202", "", "Hello", 123456);

let blockchain: Block[] = [genesisBlock]; //블록체인 배열 선언

const getBlockchain = (): Block[] => blockchain; //blockchain을 리턴

const getLatestBlock = (): Block => blockchain[blockchain.length - 1];

const getNewTimeStamp = (): number => Math.round(new Date().getTime() / 1000); //초 단위

const createNewBlock = (data: string): Block => { 
    const previousBlock: Block = getLatestBlock();
    const newIndex: number = previousBlock.index + 1;
    const newTimestamp: number = getNewTimeStamp();
    const newHash: string = Block.calculateBlockHash(newIndex, previousBlock.hash, newTimestamp, data);
    const newBlock: Block = new Block(newIndex, newHash, previousBlock.hash, data, newTimestamp);
    addBlock(newBlock);
    return newBlock;
};

const getHashforBlock = (aBlock: Block): string =>
    Block.calculateBlockHash(aBlock.index, aBlock.previousHash, aBlock.timestamp, aBlock.data);

const isBlockValid = (candidateBlock: Block, previousBlock: Block): boolean => { //블록체인 유효성 검사
    if (!Block.validateStructure(candidateBlock)) 
        return false;
    else if (previousBlock.index + 1 !== candidateBlock.index) 
        return false;
    else if (previousBlock.hash !== candidateBlock.previousHash)
        return false;
    else if (getHashforBlock(candidateBlock) !== candidateBlock.hash)
        return false;
    else
        return true;
};

const addBlock = (candidateBlock: Block): void => {
    if (isBlockValid(candidateBlock, getLatestBlock()))
        blockchain.push(candidateBlock);
};

createNewBlock("second block");
createNewBlock("third block");
createNewBlock("fourth block");

console.log(blockchain);

export {};