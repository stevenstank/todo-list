// Storage logic for localStorage
const STORAGE_KEY = 'todoAppData';

export function saveData(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function loadData() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}
