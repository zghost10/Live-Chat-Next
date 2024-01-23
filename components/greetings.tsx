import { FC, useState } from "react"
import { Button } from "./button"

type Props = {
  context: {
    setUsername: (name: string) => void
  }
}

const Greetings:FC<Props> = ({context}) => {
  const [name, setName] = useState("")
  const { setUsername } = context

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUsername(name)
  }

  return (
    <div className="container mx-auto max-w-xs flex items-center h-full">
      <form onSubmit={handleSubmit} className="flex flex-col justify-center p-10 rounded-lg bg-zinc-800 gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="username" className="font-semibold text-xl">
            Digite seu nome:
          </label>

          <input 
            id="username" type="text" value={name} onChange={(e) => setName(e.target.value)}
            className="block p-4 text-sm border rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <Button submit>Definir</Button>
      </form>
    </div>
  )
}

export default Greetings