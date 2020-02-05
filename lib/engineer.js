const Employee = require("./employee");

class Engineer extends Employee {

    static HTML_PLACEHOLDER = "ENGINEER_DATA";
    static ROLE = 'Engineer';
    static TEMPLATE = "./templates/engineer.html";
    static QUESTION = {
        type: "input", 
        message: "What´s the Engineer GitHub username?", 
        name: "github"
    };

    constructor(name, id, email, github) {
        super(name, id, email);
        this.github = github;
    }

    getRole() {
        return 'Engineer';
    }

    getGithub() {
        return this.github;
    }

}

module.exports = Engineer;