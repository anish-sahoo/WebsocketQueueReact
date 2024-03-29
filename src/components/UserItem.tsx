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
    <div className="flex flex-row w-full">
      <p>{user.name}</p>
      <p>{user.queueDuration}</p>
      <button onClick={resolve}>Resolve</button>
    </div>
  );
};

export default UserItem;
