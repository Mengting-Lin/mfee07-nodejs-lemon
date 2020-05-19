class Person {
    constructor(name='noname', age=20) {
    this.name = name;
    this.age = age;
    }
    toJSON(){
    const obj = {
    name: this.name,
    age: this.age,
    };
    return JSON.stringify(obj);
    }
    }

    // 一般
    // module.exports = Person;

    // babel語法
    export default Person;