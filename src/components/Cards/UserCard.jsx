import { Avatar } from "@heroui/react";

function UserCard({ id, type }) {
  return (
    <div>
      <div className="">
        <Avatar
          isBordered
          radius="sm"
          src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
        />
      </div>
    </div>
  );
}

export default UserCard;
