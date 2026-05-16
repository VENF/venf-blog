import Image from 'next/image'

type Props = {
  name: string
  picture: string
}

const Avatar = ({ name, picture }: Props) => {
  return (
    <div className="flex items-center gap-3">
      <Image
        src={picture}
        alt={name}
        width={40}
        height={40}
        className="size-10 rounded-full object-cover"
      />
    </div>
  )
}

export default Avatar
