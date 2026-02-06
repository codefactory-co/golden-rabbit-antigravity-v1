import { useState } from 'react';
import { Todo } from '../types';

export const useTodos = () => {
    const [todos, setTodos] = useState<Todo[]>([]);

    const addTodo = (title: string) => {
        if (!title.trim()) return;

        const newTodo: Todo = {
            id: crypto.randomUUID(),
            title: title.trim(),
            completed: false,
            createdAt: new Date(),
        };

        setTodos((prev) => [...prev, newTodo]);
    };

    const toggleTodo = (id: string) => {
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    const deleteTodo = (id: string) => {
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
    };

    const updateTodo = (id: string, newTitle: string) => {
        if (!newTitle.trim()) return;

        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id ? { ...todo, title: newTitle.trim() } : todo
            )
        );
    };

    return {
        todos,
        addTodo,
        toggleTodo,
        deleteTodo,
        updateTodo,
    };
};
