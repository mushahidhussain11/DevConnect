import React, { useEffect, useState } from "react";
import {
  Sparkles,
  BellOff,
  Bell,
  MessageCircle,
  UserPlus,
  Send,
  Trash2,
} from "lucide-react";
import { FaLaughSquint } from "react-icons/fa";
import { GiPartyPopper } from "react-icons/gi";
import { ThumbsUp, Heart } from "phosphor-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  deleteNotification,
} from "../features/user/userSlice";
import NotificationSkeleton from "./NotificationSkeleton";
import { formatDistanceToNow } from "date-fns";

// Utility to get icon for reaction type
const getReactionIcon = (type) => {
  switch (type) {
    case "love":
      return <Heart weight="fill" size={24} className="text-red-500" />;
    case "funny":
      return <FaLaughSquint size={24} color="#FFCA28" />;
    case "celebrate":
      return <GiPartyPopper size={24} color="#2ECC71" className="ml-0.5 mb-0.5" />;
    case "innovative":
      return <Sparkles className="text-primary" size={22} />;
    default:
      return <ThumbsUp weight="fill" size={22} className="text-primary" />;
  }
};

const NotificationCard = ({ notification }) => {
  const dispatch = useDispatch();
  const { type } = notification;

  const handleDelete = () => {
    try {
      dispatch(deleteNotification(notification._id));
    } catch (error) {
      console.log("Error in delete notification");
    }
  };

  return (
    <div className="relative flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-all duration-200 group">
      {/* Delete Icon */}
      <button
        onClick={handleDelete}
        aria-label="Delete notification"
        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Avatar */}
      <img
        src={notification?.senderId?.profilePic}
        alt={notification?.senderId?.fullName}
        className="w-11 h-11 rounded-full object-cover shadow-sm mt-0.5"
      />

      {/* Notification Content */}
      <div className="flex-1">
        <div className="text-sm text-gray-700 leading-relaxed flex items-start gap-2 flex-wrap">
          {(type === "like" ||
            type === "love" ||
            type === "funny" ||
            type === "celebrate" ||
            type === "innovative") && (
            <>
              <span className="pt-0.5">{getReactionIcon(notification?.type)}</span>
              <p>
                <strong className="text-gray-900">{notification?.senderId?.fullName}</strong> reacted to your post
                with{" "}
                <strong className="capitalize">{notification?.type}</strong>.
              </p>
            </>
          )}

          {type === "comment" && (
            <>
              <MessageCircle className="text-indigo-500 w-5 h-5 mt-0.5" />
              <p>
                <strong className="text-gray-900">{notification?.senderId?.fullName}</strong> commented on your post.
              </p>
            </>
          )}

          {type === "message" && (
            <>
              <Send className="text-indigo-500 w-5 h-5 mt-0.5" />
              <p>
                <strong className="text-gray-900">{notification?.senderId?.fullName}</strong> messaged you.
              </p>
            </>
          )}

          {type === "follow" && (
            <>
              <UserPlus className="text-indigo-500 w-5 h-5 mt-0.5" />
              <p>
                <strong className="text-gray-900">{notification?.senderId?.fullName}</strong> started following you.
              </p>
            </>
          )}
        </div>

        {/* Time */}
        <p className="text-xs text-gray-400 mt-2">
          {formatDistanceToNow(new Date(notification?.createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>
    </div>
  );
};

const Notification = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { notifications } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        setLoading(true);
        await dispatch(fetchNotifications(user?.user?._id)).unwrap();
      } catch (error) {
        console.log("Error in notifications ");
      } finally {
        setLoading(false);
      }
    };
    getNotifications();
  }, [dispatch, user?.user?._id]);

  return (
    <section className="w-full px-2 sm:px-0">
      <div className="bg-white rounded-xl shadow-md border border-gray-200 px-4 sm:px-6 py-6 sm:py-8 max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-primary flex items-center gap-2">
          <Bell className="w-7 h-7" /> Notifications
        </h2>

        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <NotificationSkeleton key={i} />)
          ) : notifications?.length === 0 ? (
            <div className="text-center text-gray-500 py-10 flex justify-center items-center gap-2">
              <BellOff className="w-5 h-5 text-primary" />
              <p className="text-md">No notifications found.</p>
            </div>
          ) : (
            notifications?.map((notification) => (
              <NotificationCard key={notification._id} notification={notification} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Notification;
