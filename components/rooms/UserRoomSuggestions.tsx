// components/rooms/UserRoomSuggestions.tsx
import React from 'react';
import RoomCard, { Room } from './RoomCard';


interface UserRoomSuggestionsProps {
  rooms: Room[];
  title?: string;
}

const UserRoomSuggestions: React.FC<UserRoomSuggestionsProps> = ({ rooms, title = "Sana Özel Öneriler" }) => {
  if (!rooms || rooms.length === 0) {
    return null;
  }

  return (
    <section className="mb-10 sm:mb-12">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-slate-800 dark:text-white flex items-center">
          {title}
        </h2>
      </div>
      <div className="flex overflow-x-auto space-x-4 sm:space-x-6 pb-4 custom-scrollbar -mx-4 px-4 sm:-mx-6 sm:px-6">
        {rooms.slice(0, 5).map(room => ( // En fazla 5 öneri gösterelim
          <div key={room.id} className="flex-shrink-0 w-72 sm:w-80 md:w-[340px]">
            <RoomCard room={room} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default UserRoomSuggestions;