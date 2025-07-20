import React from "react";
import ConversationItem from "./ConversationItem";

const conversations = [
  { id: "ai", name: "DevConnect AI", isAI: true },
  { id: "u1", name: "Sarah Ahmad", online: true, lastSeen: "1h ago" },
  { id: "u2", name: "Ali Zafar", online: false, lastSeen: "Yesterday" },
];

const ConversationList = ({ onSelect }) => {
  return (
    <div className="overflow-y-auto space-y-1">
      {conversations.map((conv) => (
        <ConversationItem
          key={conv.id}
          conversation={conv}
          onSelect={() => onSelect(conv)}
        />
      ))}
    </div>
  );
};

export default ConversationList;
