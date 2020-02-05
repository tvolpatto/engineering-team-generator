const inquirer = require("inquirer");
const fs = require('fs');
const Manager = require("./lib/manager");
const Intern = require("./lib/intern");
const Engineer = require("./lib/engineer");
const util = require("util");

const readFileAsync = util.promisify(fs.readFile);

const team =[];

var  roleQuestion = [
  {
    type: "list",
    message: "Who do you want to add?",
    name: "role",
    choices: [Manager.ROLE, Engineer.ROLE, Intern.ROLE, "My team is complete!"]  
  }
];

const fillTemplate = function(templateString, variables){
  return new Function("return `"+templateString +"`;").call(variables);
}

function getQuestions(clazz) {
  return [{
      type: "input",
      message: `What´s the ${clazz.ROLE}´s name?`,
      name: "name" 
    },
    {
      type: "number",
      message: `What´s the ${clazz.ROLE}´s id?`,
      name: "id",
      validate: validateId 
    },
    {
      type: "input",
      message: "What´s his/her email address?",
      name: "email" 
    },
    clazz.QUESTION
  ];      
}

function callRoleQuestion() {
  inquirer.prompt(roleQuestion).then(function(answer) {        
    switch (answer.role) {
      case Manager.ROLE :
        callQuestions(Manager.ROLE, getQuestions(Manager));
        roleQuestion[0].choices.splice(0, 1);
        break;
      case Engineer.ROLE :
        callQuestions(Engineer.ROLE, getQuestions(Engineer));
        break;
      case Intern.ROLE :
        callQuestions(Intern.ROLE, getQuestions(Intern));
        break;
      default :
        createHTML();
        break;   
    }
  }).catch(function (err) {
    console.log(err);
  });
}

function callQuestions(role, questions) {
  inquirer.prompt(questions).then(function(answers) { 
    createTeamMember(role, answers);
    callRoleQuestion();
  }).catch(function (err) {
    console.log(err);
  });
}

function createTeamMember(role, ans) {
  var member = {};
  
  switch (role) {
    case Manager.ROLE :
      member = new Manager(ans.name, ans.id, ans.email, ans.office);
      break;
    case Engineer.ROLE :
      member = new Engineer(ans.name, ans.id, ans.email, ans.github);
      break;
    case Intern.ROLE :
      member = new Intern(ans.name, ans.id, ans.email, ans.school);
      break;
  }
  team.push(member);
}

function validateId(value) {
  const exist = team.filter(t =>{ if (t.id === value) return true });
  
  if( isNaN(parseInt(value))) {
    return  'Please enter a Integer number';
  } else if (exist.length === 0) {
    return true;
  } else {
    return `${value} already in use! Please select another ID.`;
  }
}

// TODO: Refactor this method 
function createHTML() {
  readFileAsync("./templates/main.html", "utf8").then(function(data) {
    readFileAsync(Manager.TEMPLATE, "utf8").then(function(managerTemplate) {
      var manager  = filterTeamByRole(Manager.ROLE);
      var manDiv ='';   
      manager.forEach((man) =>{  manDiv += fillTemplate(managerTemplate, man);} );   
      data = data.replace(Manager.HTML_PLACEHOLDER, manDiv);

      readFileAsync(Engineer.TEMPLATE, "utf8").then(function(engTemplate) {
        var engineers  = filterTeamByRole(Engineer.ROLE);
        var engDiv ='';
        engineers.forEach((eng) =>{ engDiv += fillTemplate(engTemplate, eng);} );   
        data = data.replace(Engineer.HTML_PLACEHOLDER, engDiv);
  
        readFileAsync(Intern.TEMPLATE, "utf8").then(function(intTemplate) {
          var interns  = filterTeamByRole(Intern.ROLE);
          var intDiv ='';
          interns.forEach((int) =>{ intDiv += fillTemplate(intTemplate, int);} );   
          data = data.replace(Intern.HTML_PLACEHOLDER, intDiv);
    
          writeHTML(data);
        });
      });
    });
  });
}

function filterTeamByRole(role) {
  return team.filter((t) => {
    if (t.getRole() === role) {
      return t;
    }
  });     
}

function writeHTML(data) {
  fs.writeFile("./output/index.html", data, function(err) {
    if (err) {
      return console.log(err);
    }
    
  });
}

function init() {
  callRoleQuestion();
}

init();