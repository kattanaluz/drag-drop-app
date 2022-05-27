"use strict";
const projectInputsTemplate = document.querySelector("#project-input");
const userInputs = document.importNode(projectInputsTemplate.content, true);
const clonedInputs = userInputs.firstElementChild;
clonedInputs.id = "user-input";
const app = document.querySelector("#app");
app.insertAdjacentElement("afterbegin", clonedInputs);
function renderProjectListTemplate(location, type) {
    const template = document.querySelector("#project-list");
    const projectList = document.importNode(template.content, true);
    const section = projectList.firstElementChild;
    app.insertAdjacentElement(location, section);
    section.id = `${type}-projects`;
    const h2 = section.querySelector("h2");
    h2.innerText = type.toUpperCase() + " PROJECTS";
    const ul = section.querySelector("ul");
    ul.className = `${type}-projects-ul`;
}
renderProjectListTemplate("beforeend", "active");
renderProjectListTemplate("beforeend", "finished");
function validateInput(param) {
    let isValid = true;
    if (param.isRequired) {
        isValid = isValid && param.text.toString().trim().length > 0;
    }
    if (isValid && param.minLength) {
        isValid = isValid && param.text.toString().trim().length >= param.minLength;
    }
    if (isValid && param.maxLength) {
        isValid = isValid && param.text.toString().trim().length <= param.maxLength;
    }
    if (isValid && param.minNum) {
        isValid = isValid && param.text >= param.minNum;
    }
    if (isValid && param.maxNum) {
        isValid = isValid && param.text <= param.maxNum;
    }
    return isValid;
}
const projects = [];
function addProject(title, description, people, status) {
    projects.push({
        title: title,
        description: description,
        people: people,
        status: status,
    });
}
function renderListItem() {
    const activeUL = document.querySelector(".active-projects-ul");
    const finishedUL = document.querySelector(".finished-projects-ul");
    while (activeUL.firstChild) {
        activeUL.removeChild(activeUL.firstChild);
    }
    while (finishedUL.firstChild) {
        finishedUL.removeChild(finishedUL.firstChild);
    }
    projects.forEach((project, index) => {
        const singleProjectTemplate = document.querySelector("#single-project");
        const importedList = document.importNode(singleProjectTemplate.content, true);
        const li = importedList.firstElementChild;
        li.id = index.toString();
        const h2 = document.createElement("h2");
        h2.innerText = project.title;
        const h3 = document.createElement("h3");
        h3.innerText = project.description;
        const p = document.createElement("p");
        p.innerText = project.people.toString();
        li.appendChild(h2);
        li.appendChild(h3);
        li.appendChild(p);
        if (project.status) {
            activeUL.insertAdjacentElement("afterbegin", li);
        }
        else {
            finishedUL.insertAdjacentElement("afterbegin", li);
        }
    });
}
function dragStartHandler(e) {
    const eTarget = e.target;
    e.dataTransfer.setData("text", eTarget.id);
    e.dataTransfer.effectAllowed = "move";
    console.log(e);
}
function dragEndHandler(e) {
    let event = e.target;
    let id = +event.id;
    console.log(e);
    projects[id].status = !projects[id].status;
    renderListItem();
}
function dragOverHandler(e) {
    e.preventDefault();
    const ul = document.querySelectorAll("ul");
    ul.forEach((element) => element.classList.add("droppable"));
}
function dragLeaveHandler(e) {
    e.preventDefault();
    const ul = document.querySelectorAll("ul");
    ul.forEach((element) => element.classList.remove("droppable"));
}
function implementDragDrop() {
    const activeUl = app.querySelector(".active-projects-ul");
    const finishedUl = app.querySelector(".finished-projects-ul");
    activeUl.addEventListener("dragover", dragOverHandler);
    activeUl.addEventListener("dragleave", dragLeaveHandler);
    finishedUl.addEventListener("dragover", dragOverHandler);
    finishedUl.addEventListener("dragleave", dragLeaveHandler);
    activeUl.addEventListener("dragstart", dragStartHandler);
    finishedUl.addEventListener("dragstart", dragStartHandler);
    activeUl.addEventListener("dragend", dragEndHandler);
    finishedUl.addEventListener("dragend", dragEndHandler);
}
implementDragDrop();
function handleSubmit(event) {
    event.preventDefault();
    const titleInput = clonedInputs.querySelector("#title");
    const descriptionInput = clonedInputs.querySelector("#description");
    const peopleInput = clonedInputs.querySelector("#people");
    const title = titleInput.value;
    const description = descriptionInput.value;
    const people = +peopleInput.value;
    if (!validateInput({
        isRequired: true,
        text: title,
        maxLength: 30,
        minLength: 1,
    }) ||
        !validateInput({
            isRequired: true,
            text: description,
            maxLength: 30,
            minLength: 1,
        }) ||
        !validateInput({ isRequired: true, text: people, maxNum: 10, minNum: 1 })) {
        alert("Please enter enter valid information");
        return;
    }
    else {
        addProject(title, description, people, true);
        renderListItem();
    }
}
clonedInputs.addEventListener("submit", handleSubmit);
