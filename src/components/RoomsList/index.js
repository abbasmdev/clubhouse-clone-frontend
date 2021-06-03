import clsx from "clsx";
import React from "react";
import Room from "../Room";
import "./RoomsList.scss";
function RoomsList({
  className,
  onRoomClick,
  onJoinRoomBtnClick,
  rooms,
  isPublic,
}) {
  const onJbClick = (id) => {
    onJoinRoomBtnClick(id);
  };
  return (
    <div className={clsx("roomsList", className)}>
      {rooms?.length === 0 && <p>No room joined yet!</p>}
      {rooms?.map((room) => (
        <Room
          isPublic={isPublic}
          key={room?._id}
          room={room}
          onClick={() => onRoomClick(room._id)}
          onJoinRoomClick={() => onJbClick(room._id)}
        />
      ))}
    </div>
  );
}

export default RoomsList;
