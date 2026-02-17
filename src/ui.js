import Project from './project.js';
import { loadData, saveData } from './storage.js';

const app = document.getElementById('app');
let projects = loadData() || [new Project({ name: 'Default Project' })];
let selectedProjectId = projects[0].id;

function renderProjects() {
	const projectsList = document.createElement('div');
	projectsList.className = 'projects-list';
	projects.forEach(project => {
		const item = document.createElement('div');
		item.className = 'project-item' + (project.id === selectedProjectId ? ' selected' : '');
		item.textContent = project.name;
		item.onclick = () => {
			selectedProjectId = project.id;
			render();
		};
		projectsList.appendChild(item);
	});
	return projectsList;
}

function render() {
	app.innerHTML = '';
	app.appendChild(renderProjects());
	app.appendChild(renderTodos());
}

function renderTodos() {
	const project = projects.find(p => p.id === selectedProjectId);
	const todosDiv = document.createElement('div');
	todosDiv.className = 'todos-list';
	if (!project || !project.todos.length) {
		todosDiv.textContent = 'No todos in this project.';
		return todosDiv;
	}
	project.todos.forEach(todo => {
		const todoDiv = document.createElement('div');
		todoDiv.className = 'todo-item';
		todoDiv.style.borderLeft = `6px solid ${priorityColor(todo.priority)}`;
		todoDiv.style.margin = '8px 0';
		todoDiv.style.padding = '8px 12px';
		todoDiv.style.background = '#fafafa';
		todoDiv.style.borderRadius = '4px';
		todoDiv.innerHTML = `<strong>${todo.title}</strong> <span style="float:right;">${todo.dueDate || ''}</span>`;
		todosDiv.appendChild(todoDiv);
	});
	return todosDiv;
}

function priorityColor(priority) {
	switch(priority) {
		case 'high': return '#e53935';
		case 'medium': return '#fbc02d';
		case 'low': return '#43a047';
		default: return '#bdbdbd';
	}
}

render();
