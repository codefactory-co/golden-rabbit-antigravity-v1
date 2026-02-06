import { renderHook, act } from '@testing-library/react';
import { useTodos } from './useTodos';

describe('useTodos Hook', () => {
    describe('addTodo', () => {
        it('새로운 할 일을 추가할 수 있다', () => {
            const { result } = renderHook(() => useTodos());

            act(() => {
                result.current.addTodo('Test Todo');
            });

            expect(result.current.todos).toHaveLength(1);
            expect(result.current.todos[0].title).toBe('Test Todo');
            expect(result.current.todos[0].completed).toBe(false);
        });

        it('빈 제목으로는 할 일을 추가할 수 없다', () => {
            const { result } = renderHook(() => useTodos());

            act(() => {
                result.current.addTodo('');
            });

            expect(result.current.todos).toHaveLength(0);
        });

        it('공백만 있는 제목으로는 할 일을 추가할 수 없다', () => {
            const { result } = renderHook(() => useTodos());

            act(() => {
                result.current.addTodo('   ');
            });

            expect(result.current.todos).toHaveLength(0);
        });
    });

    describe('getTodos', () => {
        it('초기 상태는 빈 배열이어야 한다', () => {
            const { result } = renderHook(() => useTodos());
            expect(result.current.todos).toEqual([]);
        });

        it('여러 개의 할 일을 추가하면 모두 조회되어야 한다', () => {
            const { result } = renderHook(() => useTodos());

            act(() => {
                result.current.addTodo('Todo 1');
                result.current.addTodo('Todo 2');
            });

            expect(result.current.todos).toHaveLength(2);
            expect(result.current.todos[0].title).toBe('Todo 1');
            expect(result.current.todos[1].title).toBe('Todo 2');
        });

        it('추가된 순서대로 조회되어야 한다', () => {
            const { result } = renderHook(() => useTodos());

            act(() => {
                result.current.addTodo('First');
                result.current.addTodo('Second');
            });

            expect(result.current.todos[0].title).toBe('First');
            expect(result.current.todos[1].title).toBe('Second');
        });
    });

    describe('toggleTodo', () => {
        it('할 일의 완료 상태를 토글할 수 있다', () => {
            const { result } = renderHook(() => useTodos());

            act(() => {
                result.current.addTodo('Test');
            });

            const todoId = result.current.todos[0].id;

            act(() => {
                result.current.toggleTodo(todoId);
            });

            expect(result.current.todos[0].completed).toBe(true);

            act(() => {
                result.current.toggleTodo(todoId);
            });

            expect(result.current.todos[0].completed).toBe(false);
        });

        it('존재하지 않는 ID로 토글하면 아무 변화가 없다', () => {
            const { result } = renderHook(() => useTodos());

            act(() => {
                result.current.addTodo('Test');
            });

            const initialTodos = result.current.todos;

            act(() => {
                result.current.toggleTodo('non-existent-id');
            });

            expect(result.current.todos).toEqual(initialTodos);
        });

        it('토글 후에도 다른 속성은 유지되어야 한다', () => {
            const { result } = renderHook(() => useTodos());

            act(() => {
                result.current.addTodo('Test');
            });

            const todoId = result.current.todos[0].id;
            const originalTodo = { ...result.current.todos[0] };

            act(() => {
                result.current.toggleTodo(todoId);
            });

            expect(result.current.todos[0].id).toBe(originalTodo.id);
            expect(result.current.todos[0].title).toBe(originalTodo.title);
            expect(result.current.todos[0].createdAt).toEqual(originalTodo.createdAt);
        });
    });

    describe('deleteTodo', () => {
        it('할 일을 삭제할 수 있다', () => {
            const { result } = renderHook(() => useTodos());

            act(() => {
                result.current.addTodo('Test');
            });

            const todoId = result.current.todos[0].id;

            act(() => {
                result.current.deleteTodo(todoId);
            });

            expect(result.current.todos).toHaveLength(0);
        });

        it('존재하지 않는 ID로 삭제하면 아무 변화가 없다', () => {
            const { result } = renderHook(() => useTodos());

            act(() => {
                result.current.addTodo('Test');
            });

            const initialTodos = result.current.todos;

            act(() => {
                result.current.deleteTodo('non-existent-id');
            });

            expect(result.current.todos).toEqual(initialTodos);
        });

        it('특정 할 일만 삭제되어야 한다', () => {
            const { result } = renderHook(() => useTodos());

            act(() => {
                result.current.addTodo('First');
                result.current.addTodo('Second');
            });

            const firstTodoId = result.current.todos[0].id;

            act(() => {
                result.current.deleteTodo(firstTodoId);
            });

            expect(result.current.todos).toHaveLength(1);
            expect(result.current.todos[0].title).toBe('Second');
        });
    });

    describe('updateTodo', () => {
        it('할 일의 내용을 수정할 수 있다', () => {
            const { result } = renderHook(() => useTodos());

            act(() => {
                result.current.addTodo('Old Title');
            });

            const todoId = result.current.todos[0].id;

            act(() => {
                result.current.updateTodo(todoId, 'New Title');
            });

            expect(result.current.todos[0].title).toBe('New Title');
        });

        it('빈 문자열로 수정하려 하면 수정되지 않아야 한다', () => {
            const { result } = renderHook(() => useTodos());

            act(() => {
                result.current.addTodo('Old Title');
            });

            const todoId = result.current.todos[0].id;

            act(() => {
                result.current.updateTodo(todoId, '');
            });

            expect(result.current.todos[0].title).toBe('Old Title');
        });

        it('존재하지 않는 ID로 수정하면 아무 변화가 없다', () => {
            const { result } = renderHook(() => useTodos());

            act(() => {
                result.current.addTodo('Test');
            });

            const initialTodos = result.current.todos;

            act(() => {
                result.current.updateTodo('non-existent-id', 'New Title');
            });

            expect(result.current.todos).toEqual(initialTodos);
        });
    });
});
