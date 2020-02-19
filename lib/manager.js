const Employee = require("./employee");

class Manager extends Employee {

    static HTML_PLACEHOLDER = "MANAGER_DATA";
    static ROLE = 'Manager';
    static TEMPLATE = "./templates/manager.html";
    static QUESTION = {
        type: "number",
        message: "What´s the Manager office number?",
        name: "office",
        validate : (value) =>{
            if(isNaN(parseInt(value))){
                return 'Please enter a Integer number';
            }
            return true;
        }
    };

    constructor(name, id, email, officeNumber) {
        super(name, id, email);
        this.officeNumber = officeNumber;
    }

    getRole() {
        return 'Manager';
    }

    getOfficeNumber() {
        return this.officeNumber;
    }
}

module.exports = Manager;