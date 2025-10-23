import { Derive, signal, useComputed, useSignal } from "kiru"

interface Todo {
  id: number
  title: string
  completed: boolean
}
const todos = signal<Todo[]>([])

function updateTodo(todo: Todo) {
  todos.value = todos.value.map((t) => (t.id === todo.id ? todo : t))
}

export default function TodosPage() {
  const inputText = useSignal("")
  const disableSubmit = useComputed(() => !inputText.value.trim())

  const handleAddTodo = () => {
    if (disableSubmit.value) return
    todos.value = [
      ...todos.value,
      { id: Date.now(), title: inputText.value, completed: false },
    ]
    inputText.value = ""
  }

  return (
    <div className="flex flex-col gap-8 justify-center items-center">
      <form onsubmit={(e) => (e.preventDefault(), handleAddTodo())}>
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
      <Derive from={todos}>
        {(todos) => (
          <ul className="text-xl">
            {todos.length === 0 && <i>No todos</i>}
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </ul>
        )}
      </Derive>
    </div>
  )
}

function TodoItem({ todo }: { todo: Todo }) {
  return (
    <li className={todo.completed ? "opacity-50" : ""}>
      <input
        type="text"
        value={todo.title}
        onchange={(e) => updateTodo({ ...todo, title: e.target.value })}
      />
      <input
        type="checkbox"
        checked={todo.completed}
        onchange={(e) => updateTodo({ ...todo, completed: e.target.checked })}
      />
    </li>
  )
}
