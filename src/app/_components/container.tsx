type Props = {
  children?: React.ReactNode
}

const Container = ({ children }: Props) => {
  return <div className="mx-auto w-full max-w-4xl px-5">{children}</div>
}

export default Container
