import { FC, ReactNode } from "react"

type Props = {
  children?: ReactNode
  action?: () => void
  submit?: boolean
  disabled?: boolean
}

export const Button: FC<Props> = ({ children, action, submit, disabled }) => {
  return (
    <button 
      type={submit ? "submit" : "button"} onClick={() => action ? action() : {}}
      disabled={disabled}
      className={`
        ${disabled ? "bg-blue-800 text-gray-400" : "bg-blue-700 text-white"}
        hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2
      `}
    >
      {children}
    </button>
  )
}