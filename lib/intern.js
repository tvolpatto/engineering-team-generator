const Employee = require("./employee");

class Intern extends Employee {

    static HTML_PLACEHOLDER = "INTERN_DATA";
    static ROLE = 'Intern';
    static TEMPLATE = "./templates/intern.html";
    static QUESTION = {
        type: "input",
        message: "What´s the Intern school name?",
        name: "school"
    };

    constructor(name, id, email, school) {
        super(name, id, email);
        this.school = school;
    }

    getRole() {
        return 'Intern';
    }

    getSchool() {
        return this.school;
    }
    
}

module.exports = Intern;