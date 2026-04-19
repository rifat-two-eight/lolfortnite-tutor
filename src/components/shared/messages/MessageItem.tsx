import React from "react";
import TextMessage from "./TextMessage";
import OfferMessage from "./OfferMessage";
import AcceptedMessage from "./AcceptedMessage";
import RejectedMessage from "./RejectedMessage";
import RescheduledMessage from "./RescheduledMessage";
import CompletedMessage from "./CompletedMessage";

interface MessageItemProps {
    msg: any;
    user: any;
    recipient: any;
    onAccept: (id: string) => void;
    onReject: (id: string) => void;
    onReschedule: (msg: any) => void;
    onEdit: (msg: any) => void;
    onDelete: (id: string) => void;
    onPay: (msg: any) => void;
    payingOfferId: string | null;
    activeMessageId: string | null;
    setActiveMessageId: (id: string | null) => void;
    index: number;
}

const MessageItem: React.FC<MessageItemProps> = ({
    msg,
    user,
    recipient,
    onAccept,
    onReject,
    onReschedule,
    onEdit,
    onDelete,
    onPay,
    payingOfferId,
    activeMessageId,
    setActiveMessageId,
    index
}) => {
    const senderId = typeof msg.senderId === 'object' ? msg.senderId._id : msg.senderId;
    const isMe = senderId === user?._id;
    const isActive = activeMessageId === (msg._id || index);

    // Resolve Type
    let type = msg.type;

    // Fallback for older messages or complex status detection
    if (msg.text?.startsWith("OFFER:") && type === "MESSAGE") {
        type = "OFFER";
    }

    // Force COMPLETED view if status is already PAID or COMPLETED
    if (msg.status === "PAID" || msg.status === "COMPLETED") {
        type = "COMPLETED";
    }

    const commonProps = { msg, isMe, recipient };

    switch (type) {
        case "OFFER":
            return (
                <OfferMessage
                    {...commonProps}
                    onAccept={onAccept}
                    onReject={onReject}
                    onReschedule={onReschedule}
                />
            );
        case "ACCEPTED":
        case "APPROVED":
            return <AcceptedMessage {...commonProps} onPay={onPay} onReschedule={onReschedule} isPaying={payingOfferId === msg._id} />;
        case "REJECTED":
        case "CANCELLED":
        case "DECLINED":
            return <RejectedMessage {...commonProps} />;
        case "RESCHEDULED":
            return <RescheduledMessage {...commonProps} />;
        case "COMPLETED":
        case "PAID":
            return <CompletedMessage {...commonProps} />;
        default:
            return (
                <TextMessage
                    {...commonProps}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isActive={isActive}
                    onToggleActive={() => setActiveMessageId(isActive ? null : (msg._id || index))}
                />
            );
    }
};

export default MessageItem;
