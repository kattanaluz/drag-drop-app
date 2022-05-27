// ---- SELECTING THE USER INPUTS TEMPLATE AND ADDING IT TO PAGE ---- //
const projectInputsTemplate: HTMLTemplateElement =
  document.querySelector("#project-input")!;
const userInputs = document.importNode(projectInputsTemplate.content, true);
const clonedInputs = userInputs.firstElementChild as HTMLFormElement;
clonedInputs.id = "user-input";
const app: HTMLDivElement = document.querySelector("#app")!;
app.insertAdjacentElement("afterbegin", clonedInputs);

// ---- FUNCTION TO RENDER PROJECT LIST TEMPLATES ---- //
function renderProjectListTemplate(
  location: InsertPosition,
  type: "active" | "finished"
) {
  const template: HTMLTemplateElement =
    document.querySelector("#project-list")!;
  const projectList = document.importNode(template.content, true);
  const section = projectList.firstElementChild as HTMLElement;
  app.insertAdjacentElement(location, section);
  section.id = `${type}-projects`;
  const h2 = section.querySelector("h2") as HTMLHeadElement;
  h2.innerText = type.toUpperCase() + " PROJECTS";
  const ul = section.querySelector("ul") as HTMLUListElement;
  ul.className = `${type}-projects-ul`;
}

renderProjectListTemplate("beforeend", "active");
renderProjectListTemplate("beforeend", "finished");

// ----  INTERFACE AND FUNCTION TO AUTHENTICATE USER INPUTS ---- //
interface Validation {
  isRequired: boolean;
  text: string | number;
  minLength?: number;
  maxLength?: number;
  minNum?: number;
  maxNum?: number;
}

function validateInput(param: Validation): boolean {
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

// ---- PROJECT LIST ARRAY AND FUNCTIONS ---- //
interface Projects {
  title: string;
  description: string;
  people: number;
  status: boolean;
}
const projects: Projects[] = [];

function addProject(
  title: string,
  description: string,
  people: number,
  status: boolean
) {
  projects.push({
    title: title,
    description: description,
    people: people,
    status: status,
  });
}

function renderListItem() {
  // clean UI
  const activeUL = document.querySelector(
    ".active-projects-ul"
  )! as HTMLElement;
  const finishedUL = document.querySelector(
    ".finished-projects-ul"
  )! as HTMLElement;
  //
  while (activeUL.firstChild) {
    activeUL.removeChild(activeUL.firstChild);
  }
  while (finishedUL.firstChild) {
    finishedUL.removeChild(finishedUL.firstChild);
  }
  // render each project in the list
  projects.forEach((project, index) => {
    const singleProjectTemplate: HTMLTemplateElement =
      document.querySelector("#single-project")!;
    const importedList = document.importNode(
      singleProjectTemplate.content,
      true
    );
    const li = importedList.firstElementChild as HTMLLIElement;
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
    } else {
      finishedUL.insertAdjacentElement("afterbegin", li);
    }
  });
}

// ------- DRAG & DROP FUNCTIONS ----- //
function dragStartHandler(e: DragEvent) {
  const eTarget = e.target as HTMLLIElement;
  e.dataTransfer!.setData("text", eTarget.id);
  e.dataTransfer!.effectAllowed = "move";
  console.log(e);
}
function dragEndHandler(e: DragEvent) {
  //let data = e.dataTransfer!.getData("text");
  let event = e.target as HTMLLIElement;
  let id = +event.id;
  console.log(e);
  projects[id].status = !projects[id].status;
  renderListItem();
  //console.log(projects);
}
function dragOverHandler(e: DragEvent) {
  e.preventDefault();
  const ul = document.querySelectorAll("ul")!;
  ul.forEach((element) => element.classList.add("droppable"));
}
function dragLeaveHandler(e: DragEvent) {
  e.preventDefault();
  const ul = document.querySelectorAll("ul")!;
  ul.forEach((element) => element.classList.remove("droppable"));
}

function implementDragDrop() {
  const activeUl = app.querySelector(".active-projects-ul")! as HTMLElement;
  const finishedUl = app.querySelector(".finished-projects-ul")! as HTMLElement;
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

// ---- GETTING USER INPUTS TEXT ---- //
function handleSubmit(event: Event): void {
  event.preventDefault();

  const titleInput = clonedInputs.querySelector("#title") as HTMLInputElement;
  const descriptionInput = clonedInputs.querySelector(
    "#description"
  ) as HTMLInputElement;
  const peopleInput = clonedInputs.querySelector("#people") as HTMLInputElement;

  const title: string = titleInput.value;
  const description: string = descriptionInput.value;
  const people: number = +peopleInput.value;
  if (
    !validateInput({
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
    !validateInput({ isRequired: true, text: people, maxNum: 10, minNum: 1 })
  ) {
    alert("Please enter enter valid information");
    return;
  } else {
    addProject(title, description, people, true);
    renderListItem();
  }
}

clonedInputs.addEventListener("submit", handleSubmit);
