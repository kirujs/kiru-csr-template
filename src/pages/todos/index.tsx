import { Derive, signal, computed, DevTools } from "kiru"
import { className as cls } from "kiru/utils"

interface Todo {
  id: number
  title: string
  completed: boolean
}
const todos = signal<Todo[]>([])
if (import.meta.env.DEV) {
  DevTools.track(todos, "todos")
}

function updateTodo(todo: Todo) {
  todos.value = todos.value.map((t) => (t.id === todo.id ? todo : t))
}

export default function TodosPage() {
  const inputText = signal("")
  const disableSubmit = computed(() => !inputText.value.trim())

  const handleAddTodo = (e: Kiru.FormEvent) => {
    e.preventDefault()
    if (disableSubmit.value) return
    todos.value = [
      ...todos.value,
      { id: Date.now(), title: inputText.value, completed: false },
    ]
    inputText.value = ""
  }

  return () => (
    <div className="flex flex-col gap-8 justify-center items-center">
      <form onsubmit={handleAddTodo}>
        <div className="flex gap-2">
          <input
            type="text"
            bind:value={inputText}
            placeholder="Make a new Todo"
            className="bg-neutral-50/10 rounded px-4 py-2"
          />
          <button
            type="submit"
            disabled={disableSubmit}
            className="bg-neutral-50/20 rounded px-4 py-2 disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </form>
      <div>
        <Derive from={todos}>
          {(todos) => (
            <ul className="text-xl flex flex-col gap-2">
              {todos.length === 0 && <i>No todos</i>}
              {todos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </ul>
          )}
        </Derive>
      </div>
    </div>
  )
}

function TodoItem({ todo }: { todo: Todo }) {
  return (
    <li
      className={cls(
        "flex items-center gap-2 bg-neutral-50/10 rounded p-2",
        todo.completed ? "opacity-50" : ""
      )}
    >
      <input
        type="text"
        value={todo.title}
        onchange={(e) => updateTodo({ ...todo, title: e.target.value })}
        className="bg-black/30 rounded px-2 py-1"
      />
      <input
        type="checkbox"
        checked={todo.completed}
        onchange={(e) => updateTodo({ ...todo, completed: e.target.checked })}
        className="w-6 h-6"
      />
    </li>
  )
}
