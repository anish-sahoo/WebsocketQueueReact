type User = {
  name: string;
  id: number;
  queueDuration: string;
};

type UserItemProps = {
  user: User;
  resolve: () => void;
};

const UserItem = ({ user, resolve }: UserItemProps) => {
  return (
    <div className="flex flex-row w-full bg-white px-2 md:px-48 py-4 my-1">
      <p className="text-xl capitalize font-sans font-semibold">{user.name}</p>
      <p className="text-lg italic">{user.queueDuration}</p>
      <button onClick={resolve}>Resolve</button>
    </div>
  );
};

export default UserItem;
