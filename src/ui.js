

import Project from './project.js';
import Todo from './todo.js';
import { loadData, saveData } from './storage.js';
import { format, parseISO, isValid } from 'date-fns';

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

	// Add new project form
	const form = document.createElement('form');
	form.style.display = 'inline-block';
	form.style.marginLeft = '16px';
	form.onsubmit = e => {
		e.preventDefault();
		const input = form.querySelector('input');
		const name = input.value.trim();
		if (name) {
			const newProject = new Project({ name });
			projects.push(newProject);
			selectedProjectId = newProject.id;
			saveData(projects);
			render();
		}
		input.value = '';
	};
	const input = document.createElement('input');
	input.type = 'text';
	input.placeholder = 'New project name';
	input.style.marginRight = '4px';
	form.appendChild(input);
	const btn = document.createElement('button');
	btn.type = 'submit';
	btn.textContent = '+';
	form.appendChild(btn);
	projectsList.appendChild(form);

	return projectsList;
}

function render() {
	app.innerHTML = '';
	app.appendChild(renderProjects());
	app.appendChild(renderTodos());
}

let expandedTodoId = null;

function renderTodos() {
	const project = projects.find(p => p.id === selectedProjectId);
	const todosDiv = document.createElement('div');
	todosDiv.className = 'todos-list';

	// Add new todo form
	if (project) {
		const form = document.createElement('form');
		form.style.marginBottom = '16px';
		form.onsubmit = e => {
			e.preventDefault();
			const title = form.querySelector('input[name="title"]').value.trim();
			const dueDate = form.querySelector('input[name="dueDate"]').value;
			const priority = form.querySelector('select[name="priority"]').value;
			if (title) {
				const newTodo = new Todo({ title, dueDate, priority });
				project.todos.push(newTodo);
				saveData(projects);
				render();
			}
			form.reset();
		};
		form.innerHTML = `
			<input name="title" type="text" placeholder="Todo title" required style="margin-right:4px;" />
			<input name="dueDate" type="date" style="margin-right:4px;" />
			<select name="priority" style="margin-right:4px;">
				<option value="low">Low</option>
				<option value="medium">Medium</option>
				<option value="high">High</option>
			</select>
			<button type="submit">Add Todo</button>
		`;
		todosDiv.appendChild(form);
	}

	if (!project || !project.todos.length) {
		todosDiv.appendChild(document.createTextNode('No todos in this project.'));
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
		todoDiv.style.cursor = 'pointer';
		let formattedDate = '';
		if (todo.dueDate) {
			const parsed = parseISO(todo.dueDate);
			formattedDate = isValid(parsed) ? format(parsed, 'MMM d, yyyy') : todo.dueDate;
		}
		todoDiv.innerHTML = `<strong>${todo.title}</strong> <span style=\"float:right;\">${formattedDate}</span>`;
		todoDiv.onclick = () => {
			expandedTodoId = expandedTodoId === todo.id ? null : todo.id;
			render();
		};
		todosDiv.appendChild(todoDiv);
		if (expandedTodoId === todo.id) {
			todosDiv.appendChild(renderTodoDetails(todo, project));
		}
	});
	return todosDiv;
}

function renderTodoDetails(todo, project) {
	const detailsDiv = document.createElement('div');
	detailsDiv.className = 'todo-details';
	detailsDiv.style.background = '#e3f2fd';
	detailsDiv.style.margin = '0 0 12px 0';
	detailsDiv.style.padding = '12px';
	detailsDiv.style.borderRadius = '4px';
	detailsDiv.innerHTML = `
		<div><b>Description:</b> <span>${todo.description || ''}</span></div>
		<div><b>Due Date:</b> <input type="date" value="${todo.dueDate || ''}" id="dueDate-${todo.id}" /></div>
		<div><b>Priority:</b> <select id="priority-${todo.id}">
			<option value="low" ${todo.priority === 'low' ? 'selected' : ''}>Low</option>
			<option value="medium" ${todo.priority === 'medium' ? 'selected' : ''}>Medium</option>
			<option value="high" ${todo.priority === 'high' ? 'selected' : ''}>High</option>
		</select></div>
		<div><b>Notes:</b> <textarea id="notes-${todo.id}">${todo.notes || ''}</textarea></div>
		<button id="save-${todo.id}">Save</button>
		<button id="delete-${todo.id}" style="margin-left:12px;color:#fff;background:#e53935;border:none;padding:6px 12px;border-radius:4px;">Delete</button>
	`;
	setTimeout(() => {
		const saveBtn = document.getElementById(`save-${todo.id}`);
		if (saveBtn) {
			saveBtn.onclick = () => {
				todo.dueDate = document.getElementById(`dueDate-${todo.id}`).value;
				todo.priority = document.getElementById(`priority-${todo.id}`).value;
				todo.notes = document.getElementById(`notes-${todo.id}`).value;
				saveData(projects);
				render();
			};
		}
		const deleteBtn = document.getElementById(`delete-${todo.id}`);
		if (deleteBtn) {
			deleteBtn.onclick = () => {
				const idx = project.todos.findIndex(t => t.id === todo.id);
				if (idx !== -1) {
					project.todos.splice(idx, 1);
					saveData(projects);
					expandedTodoId = null;
					render();
				}
			};
		}
	}, 0);
	return detailsDiv;
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
